import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, testDatabaseConnection, createAdminUser } from '../config/database';
import { auth, checkRole } from '../middleware/auth';
import { z } from 'zod';
import type { RowDataPacket } from 'mysql2';
import fs from 'fs';

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
    
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
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
    const [rows]: [RowDataPacket[], unknown] = await pool.query('SELECT * FROM units WHERE active = true');
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
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
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
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
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
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
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
    const [rows]: [RowDataPacket[], unknown] = await pool.query('SELECT * FROM products WHERE active = true');
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
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
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
    // Garante que as tabelas existem e trata erros de ausência de dados
    let totalRevenue = 0, totalOrders = 0, totalRentals = 0, totalCustomers = 0;
    try {
      const [revenueRows]: [RowDataPacket[], unknown] = await pool.query(
        `SELECT IFNULL(SUM(total),0) as totalRevenue FROM (
          SELECT total FROM orders WHERE status = 'entregue'
          UNION ALL
          SELECT total FROM rentals WHERE payment_status = 'pago'
        ) as all_totals`
      );
      totalRevenue = revenueRows[0]?.totalRevenue || 0;
    } catch (e) { totalRevenue = 0; }
    try {
      const [ordersRows]: [RowDataPacket[], unknown] = await pool.query(
        `SELECT COUNT(*) as totalOrders FROM orders`);
      totalOrders = ordersRows[0]?.totalOrders || 0;
    } catch (e) { totalOrders = 0; }
    try {
      const [rentalsRows]: [RowDataPacket[], unknown] = await pool.query(
        `SELECT COUNT(*) as totalRentals FROM rentals`);
      totalRentals = rentalsRows[0]?.totalRentals || 0;
    } catch (e) { totalRentals = 0; }
    try {
      const [customersRows]: [RowDataPacket[], unknown] = await pool.query(
        `SELECT COUNT(*) as totalCustomers FROM customers`);
      totalCustomers = customersRows[0]?.totalCustomers || 0;
    } catch (e) { totalCustomers = 0; }

    // Novos campos esperados pelo frontend
    const stats = {
      orders: totalOrders,
      ordersChange: 0, // implementar cálculo se necessário
      occupiedTables: 0, // implementar cálculo real
      totalTables: 0, // implementar cálculo real
      reservationsToday: 0, // implementar cálculo real
      nextReservation: '', // implementar cálculo real
      rentedItems: totalRentals, // ou implementar cálculo real
      pendingDeliveries: 0, // implementar cálculo real
      activeCustomers: totalCustomers,
      customersChange: 0, // implementar cálculo se necessário
      dailyRevenue: totalRevenue, // ou implementar cálculo real diário
      dailyRevenueChange: 0 // implementar cálculo se necessário
    };
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar stats do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar stats do dashboard' });
  }
});

app.get('/api/dashboard/recent-orders', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT o.id, o.table_id, t.number as table_number, c.name as customer, o.total, o.status, o.created_at
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN tables t ON o.table_id = t.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    // Log detalhado do erro para debug
    console.error('Erro ao buscar pedidos recentes:', error && error.message ? error.message : error);
    if (error && error.stack) console.error(error.stack);
    res.status(500).json({ error: 'Erro ao buscar pedidos recentes', details: error && error.message ? error.message : error });
  }
});

app.get('/api/dashboard/recent-rentals', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
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
    const [rows]: [RowDataPacket[], unknown] = await pool.query(query, params);
    for (const order of rows) {
      const [items]: [RowDataPacket[], unknown] = await pool.query(
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
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
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
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT r.id, 
              COALESCE(c.name, '') as name, 
              r.date, 
              r.time_start, 
              r.time_end, 
              r.people, 
              r.status, 
              COALESCE(t.number, 0) as table_number, 
              COALESCE(c.phone, '') as contact
       FROM reservations r
       LEFT JOIN customers c ON r.customer_id = c.id
       LEFT JOIN tables t ON r.table_id = t.id
       ORDER BY r.date DESC, r.time_start DESC`
    );
    console.log('Reservas retornadas:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error && error.message ? error.message : error);
    if (error && error.stack) console.error(error.stack);
    res.status(500).json({ error: 'Erro ao buscar reservas', details: error && error.message ? error.message : error });
  }
});

// --- Multi-Tenant: Cadastro de Cliente/Estabelecimento e Criação de Banco ---
const tenantSchema = z.object({
  name: z.string().min(3),
  dbName: z.string().min(3),
  dbUser: z.string().min(1),
  dbPassword: z.string().min(1),
  dbHost: z.string().min(3),
  dbPort: z.number().int().min(1)
});

// Tabela central de tenants (clientes)
app.post('/api/tenants', async (req, res) => {
  try {
    const data = tenantSchema.parse(req.body);
    // Conecta no banco "mestre" para criar o novo banco do cliente
    const masterPool = await import('mysql2/promise').then(mysql => mysql.createPool({
      host: process.env.DB_HOST || '189.83.186.160',
      user: process.env.DB_USER || 'alesxandro',
      password: process.env.DB_PASSWORD || '46302113',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0
    }));
    // Cria o banco de dados do cliente
    await masterPool.query(`CREATE DATABASE IF NOT EXISTS \`${data.dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    // Executa o script de estrutura (ajuste o caminho se necessário)
    const sql = fs.readFileSync('database_script.sql', 'utf8');
    const clientPool = await import('mysql2/promise').then(mysql => mysql.createPool({
      host: data.dbHost,
      user: data.dbUser,
      password: data.dbPassword,
      database: data.dbName,
      port: data.dbPort,
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0
    }));
    for (const statement of sql.split(';')) {
      if (statement.trim()) {
        await clientPool.query(statement);
      }
    }
    // Salva o tenant na tabela central (crie a tabela tenants no banco mestre)
    await masterPool.query(
      'CREATE TABLE IF NOT EXISTS tenants (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), db_name VARCHAR(100), db_host VARCHAR(100), db_user VARCHAR(100), db_password VARCHAR(100), db_port INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
    );
    await masterPool.query(
      'INSERT INTO tenants (name, db_name, db_host, db_user, db_password, db_port) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.dbName, data.dbHost, data.dbUser, data.dbPassword, data.dbPort]
    );
    res.status(201).json({ message: 'Cliente cadastrado e banco criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    res.status(500).json({ error: 'Erro ao cadastrar cliente ou criar banco.' });
  }
});

// --- Financeiro de Locação de Itens ---
app.get('/api/rental/finance/summary', auth, async (req, res) => {
  try {
    // Receita: soma dos pagos
    const [revenueRows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT IFNULL(SUM(total),0) as revenue FROM rentals WHERE payment_status = 'pago'`
    );
    // Despesas: simulado (pode ser ajustado para buscar de uma tabela real)
    // const [expenseRows]: [RowDataPacket[], unknown] = await pool.query(
    //   `SELECT IFNULL(SUM(cost),0) as expenses FROM rental_items` // cost não existe, simular/desenvolver depois
    // );
    const revenue = revenueRows[0]?.revenue || 0;
    const expenses = 0; // Ajuste para despesas reais se houver
    const profit = revenue - expenses;
    res.json({ revenue, expenses, profit, revenueChange: 0, expensesChange: 0, profitChange: 0 });
  } catch (error) {
    console.error('Erro no summary financeiro de locação:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo financeiro da locação' });
  }
});

app.get('/api/rental/finance/monthly', auth, async (req, res) => {
  try {
    // Receita mensal dos últimos 12 meses
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT DATE_FORMAT(event_date, '%Y-%m') as name, SUM(total) as revenue
       FROM rentals WHERE payment_status = 'pago'
       GROUP BY name ORDER BY name DESC LIMIT 12`
    );
    res.json(rows.reverse());
  } catch (error) {
    console.error('Erro no financeiro mensal de locação:', error);
    res.status(500).json({ error: 'Erro ao buscar receita mensal da locação' });
  }
});

app.get('/api/rental/finance/event-type', auth, async (req, res) => {
  try {
    // Receita por tipo de evento (usando notes como tipo)
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT notes as name, SUM(total) as value FROM rentals WHERE payment_status = 'pago' GROUP BY notes`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro no financeiro por tipo de evento:', error);
    res.status(500).json({ error: 'Erro ao buscar receita por tipo de evento' });
  }
});

app.get('/api/rental/finance/transactions', auth, async (req, res) => {
  try {
    // Transações recentes de locação
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT r.id, r.event_date as date, CONCAT('Locação ', r.id) as description, r.total as amount, r.payment_status as type, c.name as client, r.notes as eventType
       FROM rentals r LEFT JOIN customers c ON r.customer_id = c.id
       ORDER BY r.event_date DESC, r.id DESC LIMIT 20`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar transações financeiras da locação:', error);
    res.status(500).json({ error: 'Erro ao buscar transações financeiras da locação' });
  }
});

// Schema de validação para clientes
const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  document: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  type: z.string().optional().or(z.literal('')) // para compatibilidade futura
});

// Listar clientes
app.get('/api/customers', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], unknown] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Criar cliente
app.post('/api/customers', auth, async (req, res) => {
  try {
    const data = customerSchema.parse(req.body);
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
      'INSERT INTO customers (name, email, phone, address, document, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.email || null, data.phone || null, data.address || null, data.document || null, data.notes || null]
    );
    res.status(201).json({ id: result.insertId, ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// Editar cliente
app.put('/api/customers/:id', auth, async (req, res) => {
  try {
    const data = customerSchema.parse(req.body);
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
      'UPDATE customers SET name=?, email=?, phone=?, address=?, document=?, notes=? WHERE id=?',
      [data.name, data.email || null, data.phone || null, data.address || null, data.document || null, data.notes || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ id: Number(req.params.id), ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao editar cliente:', error);
    res.status(500).json({ error: 'Erro ao editar cliente' });
  }
});

// Remover cliente
app.delete('/api/customers/:id', auth, async (req, res) => {
  try {
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
      'DELETE FROM customers WHERE id=?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    res.status(500).json({ error: 'Erro ao remover cliente' });
  }
});

// Schema de validação para usuários (funcionários)
const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(), // só obrigatório no cadastro
  role: z.enum(['admin', 'manager', 'cashier', 'waiter', 'supervisor']),
  active: z.boolean().optional()
});

// Listar funcionários
app.get('/api/users', auth, async (req, res) => {
  try {
    const [rows]: [RowDataPacket[], unknown] = await pool.query('SELECT id, name, email, role, active, created_at, updated_at FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// Criar funcionário
app.post('/api/users', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
      'INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.email, hashedPassword, data.role, data.active !== false]
    );
    res.status(201).json({ id: result.insertId, ...data, password: undefined });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
});

// Editar funcionário
app.put('/api/users/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const data = userSchema.omit({ password: true }).parse(req.body);
    let updateQuery = 'UPDATE users SET name=?, email=?, role=?, active=?';
    const params = [data.name, data.email, data.role, data.active !== false, req.params.id];
    if (req.body.password) {
      updateQuery = 'UPDATE users SET name=?, email=?, role=?, active=?, password=? WHERE id=?';
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      params.splice(4, 0, hashedPassword); // insere o password antes do id
    } else {
      updateQuery += ' WHERE id=?';
    }
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(updateQuery, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.json({ id: Number(req.params.id), ...data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    console.error('Erro ao editar funcionário:', error);
    res.status(500).json({ error: 'Erro ao editar funcionário' });
  }
});

// Remover funcionário
app.delete('/api/users/:id', auth, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const [result]: [import('mysql2').ResultSetHeader, unknown] = await pool.query(
      'DELETE FROM users WHERE id=?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover funcionário:', error);
    res.status(500).json({ error: 'Erro ao remover funcionário' });
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