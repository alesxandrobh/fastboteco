
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewOrderDialogProps {
  newTable: string;
  onTableChange: (value: string) => void;
  onClose: () => void;
  onCreateOrder: () => void;
}

export const NewOrderDialog = ({ 
  newTable, 
  onTableChange, 
  onClose, 
  onCreateOrder 
}: NewOrderDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar Novo Pedido</DialogTitle>
        <DialogDescription>Insira o número da mesa para criar um novo pedido.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="table" className="text-right">Mesa</Label>
          <Input
            id="table"
            type="number"
            min="1"
            value={newTable}
            onChange={(e) => onTableChange(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onCreateOrder}>Criar Pedido</Button>
      </DialogFooter>
    </DialogContent>
  );
};
