-- Script para criar uma empresa de teste e popular todas as tabelas principais do banco barfesta_db

-- Criação do banco (caso não exista)
CREATE DATABASE IF NOT EXISTS barfesta_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barfesta_db;

-- Usuário admin
INSERT INTO users (name, email, password, role, active) VALUES
  ('Admin Teste', 'admin+teste@barfesta.com', '$2b$10$5LC/5Bza7XjhqIKEmWFFB.wf3GtdKZCi7B4O1Lei/QIOGDfgm5uBK', 'admin', true)
ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), active=true;

-- Unidade
INSERT INTO units (name, address, phone, active) VALUES
  ('Bar Teste', 'Rua Exemplo, 123, Centro', '(11) 99999-0000', true)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Mesas
INSERT INTO tables (unit_id, number, seats, status, active) VALUES
  (1, 1, 4, 'disponível', true),
  (1, 2, 6, 'ocupada', true),
  (1, 3, 2, 'reservada', true)
ON DUPLICATE KEY UPDATE seats=VALUES(seats);

-- Categorias de produtos
INSERT INTO product_categories (name, type) VALUES
  ('Bebidas', 'drink'),
  ('Comidas', 'food'),
  ('Itens para Festa', 'rental')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Produtos
INSERT INTO products (category_id, name, description, price, cost, active, is_rental) VALUES
  (1, 'Cerveja', 'Cerveja gelada', 10.00, 5.00, true, false),
  (2, 'Porção de Batata', 'Batata frita crocante', 25.00, 10.00, true, false),
  (3, 'Bexigas', 'Pacote com 50 bexigas', 15.00, 5.00, true, true)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Clientes
INSERT INTO customers (name, email, phone, address, document, notes) VALUES
  ('Cliente Teste', 'cliente@teste.com', '(11) 88888-0000', 'Rua Cliente, 456', '12345678900', 'VIP'),
  ('Empresa Festa', 'empresa@festa.com', '(11) 77777-0000', 'Av. Festa, 789', '98765432100', 'Corporativo')
ON DUPLICATE KEY UPDATE phone=VALUES(phone);

-- Pedidos
INSERT INTO orders (unit_id, table_id, customer_id, user_id, status, total, payment_status, payment_method, notes) VALUES
  (1, 1, 1, 1, 'entregue', 50.00, 'pago', 'dinheiro', 'Pedido teste 1'),
  (1, 2, 2, 1, 'pronto', 80.00, 'pendente', 'cartao', 'Pedido teste 2')
ON DUPLICATE KEY UPDATE total=VALUES(total);

-- Itens do pedido
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, notes) VALUES
  (1, 1, 2, 10.00, 20.00, '2 cervejas'),
  (1, 2, 1, 25.00, 25.00, '1 porção'),
  (2, 3, 2, 15.00, 30.00, '2 pacotes de bexiga')
ON DUPLICATE KEY UPDATE total_price=VALUES(total_price);

-- Reservas
INSERT INTO reservations (unit_id, table_id, customer_id, user_id, date, time_start, time_end, people, status, notes) VALUES
  (1, 3, 1, 1, CURDATE(), '19:00:00', '21:00:00', 4, 'confirmada', 'Reserva teste')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Locações
INSERT INTO rentals (customer_id, user_id, event_date, delivery_date, return_date, status, total, payment_status, payment_method, notes) VALUES
  (2, 1, CURDATE(), CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'confirmado', 200.00, 'pago', 'pix', 'Locação teste')
ON DUPLICATE KEY UPDATE total=VALUES(total);

-- Itens da locação
INSERT INTO rental_items (rental_id, product_id, quantity, unit_price, total_price) VALUES
  (1, 3, 10, 15.00, 150.00)
ON DUPLICATE KEY UPDATE total_price=VALUES(total_price);

-- Caixa
INSERT INTO cash_register (unit_id, user_id, opening_date, opening_amount, status, notes) VALUES
  (1, 1, NOW(), 500.00, 'aberto', 'Abertura teste')
ON DUPLICATE KEY UPDATE opening_amount=VALUES(opening_amount);
