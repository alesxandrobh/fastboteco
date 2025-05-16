
import React from "react";
import { Order } from "../types";
import { formatCurrency, formatTimestamp } from "../utils";

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
  onDragStart: (e: React.DragEvent, order: Order) => void;
}

export const OrderCard = ({ order, onClick, onDragStart }: OrderCardProps) => {
  return (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => onDragStart(e, order)}
      onClick={() => onClick(order)}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{order.id}</span>
        <span className="text-sm text-muted-foreground">Mesa #{order.table}</span>
      </div>
      <div className="border-t pt-2 flex justify-between">
        <span>{order.items.length} itens</span>
        <span className="font-medium">{formatCurrency(order.total)}</span>
      </div>
      <div className="text-xs text-right text-muted-foreground mt-1">
        {formatTimestamp(order.timestamp)}
      </div>
    </div>
  );
};
