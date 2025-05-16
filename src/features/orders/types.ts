
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  table: number;
  items: OrderItem[];
  status: "novo" | "preparando" | "pronto" | "entregue";
  total: number;
  timestamp: Date;
}

export type OrderStatus = Order["status"];
