
import React from "react";
import { Order, OrderStatus } from "../types";
import { OrderCard } from "./OrderCard";

interface KanbanColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: OrderStatus) => void;
  onOrderClick: (order: Order) => void;
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

export const KanbanColumn = ({
  title,
  status,
  orders,
  onDragOver,
  onDrop,
  onOrderClick,
  onDragStart,
}: KanbanColumnProps) => {
  const filteredOrders = orders.filter(order => order.status === status);

  return (
    <div
      className="kanban-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {filteredOrders.map(order => (
          <OrderCard 
            key={order.id}
            order={order}
            onClick={onOrderClick}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};
