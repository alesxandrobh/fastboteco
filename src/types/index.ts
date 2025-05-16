export interface Unit {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: number;
  unit_id: number;
  number: number;
  seats: number;
  status: 'disponível' | 'ocupada' | 'reservada';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  cost: number;
  image_url: string | null;
  active: boolean;
  is_rental: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  type: 'food' | 'drink' | 'rental';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  unit_id: number;
  table_id: number | null;
  customer_id: number | null;
  user_id: number;
  status: 'novo' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  total: number;
  payment_status: 'pendente' | 'pago' | 'parcial';
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Adiciona a tipagem para Reservation
export interface Reservation {
  id: number;
  name: string;
  date: string; // formato ISO (YYYY-MM-DD)
  time_start: string; // formato HH:mm:ss
  time_end: string; // formato HH:mm:ss
  people: number;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'concluída';
  table: number;
  contact: string;
}