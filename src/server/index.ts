import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, testDatabaseConnection, createAdminUser } from '../config/database';
import { auth, checkRole } from '../middleware/auth';
import { z } from 'zod';
import type { RowDataPacket } from 'mysql2';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

// Middleware para verificar a conexão com o banco
app.use(async (req, res, next) => {
  try {
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
    }
    next();
  } catch (error) {
    console.error('Erro no middleware de conexão:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const [rows]: [RowDataPacket[], any] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND active = true',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota protegida de teste
app.get('/api/test', auth, async (req, res) => {
  try {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      res.json({ message: 'Conexão com o banco de dados estabelecida com sucesso!' });
    } else {
      res.status(500).json({ error: 'Falha na conexão com o banco de dados' });
    }
  } catch (error) {
    console.error('Erro no teste de conexão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Schema de validação para unidades
const unitSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  address: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  phone: z.string().optional()
});

// Rota para listar unidades (protegida)
app.get('/api/units', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query('SELECT * FROM units WHERE active = true');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});

// Rota para criar unidade (protegida, apenas admin e manager)
app.post('/api/units', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = unitSchema.parse(req.body);
    const [result]: [import('mysql2').ResultSetHeader, any] = await pool.query(
      'INSERT INTO units (name, address, phone) VALUES (?, ?, ?)',
      [data.name, data.address, data.phone]
    );
    res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar unidade:', error);
    res.status(500).json({ error: 'Erro ao criar unidade' });
  }
});

// Schema de validação para mesas
const tableSchema = z.object({
  number: z.number().int().positive('Número da mesa deve ser positivo'),
  seats: z.number().int().min(1, 'Mesa deve ter pelo menos 1 lugar')
});

// Rota para listar mesas de uma unidade (protegida)
app.get('/api/units/:unitId/tables', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query(
      'SELECT * FROM tables WHERE unit_id = ? AND active = true',
      [req.params.unitId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar mesas:', error);
    res.status(500).json({ error: 'Erro ao buscar mesas' });
  }
});

// Rota para criar mesa em uma unidade (protegida, apenas admin e manager)
app.post('/api/units/:unitId/tables', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = tableSchema.parse(req.body);
    const [result]: [import('mysql2').ResultSetHeader, any] = await pool.query(
      'INSERT INTO tables (unit_id, number, seats) VALUES (?, ?, ?)',
      [req.params.unitId, data.number, data.seats]
    );
    res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar mesa:', error);
    res.status(500).json({ error: 'Erro ao criar mesa' });
  }
});

// Schema de validação para produtos
const productSchema = z.object({
  category_id: z.number().int().positive(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  cost: z.number().positive('Custo deve ser positivo'),
  is_rental: z.boolean().default(false)
});

// Rota para listar produtos (protegida)
app.get('/api/products', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query('SELECT * FROM products WHERE active = true');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Rota para criar produto (protegida, apenas admin e manager)
app.post('/api/products', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const [result]: [import('mysql2').ResultSetHeader, any] = await pool.query(
      'INSERT INTO products (category_id, name, description, price, cost, is_rental) VALUES (?, ?, ?, ?, ?, ?)',
      [data.category_id, data.name, data.description, data.price, data.cost, data.is_rental]
    );
    res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Rotas para o Dashboard (dados simulados, ajuste para dados reais depois)
app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const [revenueRows]: [RowDataPacket[], any] = await pool.query(
      `SELECT IFNULL(SUM(total),0) as totalRevenue FROM (
        SELECT total FROM orders WHERE status = 'entregue'
        UNION ALL
        SELECT total FROM rentals WHERE payment_status = 'pago'
      ) as all_totals`
    );
    const totalRevenue = revenueRows[0]?.totalRevenue || 0;
    const [ordersRows]: [RowDataPacket[], any] = await pool.query(
      `SELECT COUNT(*) as totalOrders FROM orders`);
    const totalOrders = ordersRows[0]?.totalOrders || 0;
    const [rentalsRows]: [RowDataPacket[], any] = await pool.query(
      `SELECT COUNT(*) as totalRentals FROM rentals`);
    const totalRentals = rentalsRows[0]?.totalRentals || 0;
    const [customersRows]: [RowDataPacket[], any] = await pool.query(
      `SELECT COUNT(*) as totalCustomers FROM customers`);
    const totalCustomers = customersRows[0]?.totalCustomers || 0;
    res.json({ totalRevenue, totalOrders, totalRentals, totalCustomers });
  } catch (error) {
    console.error('Erro ao buscar stats do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar stats do dashboard' });
  }
});

app.get('/api/dashboard/recent-orders', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query(
      `SELECT o.id, o.table_id as table, c.name as customer, o.total, o.status, o.created_at
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos recentes' });
  }
});

app.get('/api/dashboard/recent-rentals', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query(
      `SELECT r.id, c.name as client, r.event_date as date, r.total as totalValue, r.status, r.notes as eventType
       FROM rentals r
       LEFT JOIN customers c ON r.customer_id = c.id
       ORDER BY r.event_date DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar locações recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar locações recentes' });
  }
});

// Rota para pedidos da cozinha (Kitchen)
app.get('/orders', auth, async (req, res) => {
  try {
    const status = req.query.status;
    let query = `SELECT o.*, c.name as customer_name FROM orders o LEFT JOIN customers c ON o.customer_id = c.id`;
    const params: unknown[] = [];
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    query += ' ORDER BY o.created_at DESC';
    const [rows]: [RowDataPacket[], any] = await pool.query(query, params);
    for (const order of rows) {
      const [items]: [RowDataPacket[], any] = await pool.query(
        `SELECT oi.*, p.name, p.price FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos da cozinha:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos da cozinha' });
  }
});

// Rota para locações (Rentals)
app.get('/api/rentals', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query(
      `SELECT r.id, c.name as client, r.event_date as date, r.total as totalValue, r.status, r.notes as eventType
       FROM rentals r
       LEFT JOIN customers c ON r.customer_id = c.id
       ORDER BY r.event_date DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar locações:', error);
    res.status(500).json({ error: 'Erro ao buscar locações' });
  }
});

// Rota para reservas (Reservations)
app.get('/api/reservations', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query(
      `SELECT r.id, c.name, r.date, r.time_start, r.time_end, r.people, r.status, t.number as table, c.phone as contact
       FROM reservations r
       LEFT JOIN customers c ON r.customer_id = c.id
       LEFT JOIN tables t ON r.table_id = t.id
       ORDER BY r.date DESC, r.time_start DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

// Inicialização do servidor
app.listen(port, async () => {
  try {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      console.log(`Servidor rodando em http://localhost:${port}`);
      console.log('Conexão com o banco de dados estabelecida com sucesso!');
      await createAdminUser();
    } else {
      console.error('Falha ao conectar com o banco de dados');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
});