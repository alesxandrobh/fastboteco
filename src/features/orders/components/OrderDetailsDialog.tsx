
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "../types";
import { formatCurrency, formatTimestamp } from "../utils";

interface OrderDetailsDialogProps {
  order: Order;
  onClose: () => void;
  onAdvanceStatus: (order: Order) => void;
}

export const OrderDetailsDialog = ({ 
  order, 
  onClose, 
  onAdvanceStatus 
}: OrderDetailsDialogProps) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          Detalhes do Pedido {order.id} - Mesa #{order.table}
        </DialogTitle>
        <DialogDescription>
          Criado às {formatTimestamp(order.timestamp)}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="border rounded-md p-3">
          <h4 className="font-medium mb-2">Itens do Pedido</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Status atual:</span>
          <span className="capitalize font-medium">{order.status}</span>
        </div>
      </div>
      <DialogFooter className="sm:justify-between">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        {order.status !== "entregue" && (
          <Button onClick={() => onAdvanceStatus(order)}>
            {order.status === "novo" ? "Iniciar Preparo" : 
             order.status === "preparando" ? "Marcar como Pronto" : 
             "Confirmar Entrega"}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};
