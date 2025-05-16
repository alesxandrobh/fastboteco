// Configuração de conexão com banco de dados MySQL

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';

dotenv.config();

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

const dbConfig: DatabaseConfig = {
  host: '192.168.100.151',
  user: 'alesxandro',
  password: '46302113',
  port: 3306,
  database: 'barfesta_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Configuração do pool de conexões
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '192.168.100.151',
  user: process.env.DB_USER || 'alesxandro',
  password: process.env.DB_PASSWORD || '46302113',
  database: process.env.DB_NAME || 'barfesta_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão com o banco
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return false;
  }
};

// Função para criar usuário admin inicial se não existir
export const createAdminUser = async (): Promise<void> => {
  try {
    // Tipagem correta para retorno do pool.query
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      ['admin@barfesta.com', 'admin']
    );

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin@barfesta.com', hashedPassword, 'admin']
      );
      console.log('Usuário admin criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
};

/**
 * Esta é uma configuração básica para MySQL.
 * 
 * Para implementar a conexão real, você precisará:
 * 
 * 1. Instalar pacotes como mysql2 ou typeorm:
 *    npm install mysql2
 *    ou
 *    npm install typeorm mysql2
 *    
 * 2. Criar um serviço de conexão utilizando essa configuração
 * 
 * 3. Implementar funções de consulta, inserção, atualização e deleção
 */

// O código abaixo é um exemplo de como configurar uma conexão básica
// Descomente e instale as dependências necessárias quando estiver pronto para implementar

/*
import mysql from 'mysql2/promise';

// Pool de conexões para melhor performance
export async function createDbConnection() {
  return await mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Exemplo de uso:
// const db = await createDbConnection();
// const [rows] = await db.query('SELECT * FROM users');
*/
