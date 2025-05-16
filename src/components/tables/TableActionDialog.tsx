
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TableData } from "./TableTypes";

interface TableActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTable: TableData | null;
  onTableAction: (action: string) => void;
  onRemoveTable: () => void;
}

const TableActionDialog = ({
  isOpen,
  onOpenChange,
  selectedTable,
  onTableAction,
  onRemoveTable,
}: TableActionDialogProps) => {
  if (!selectedTable) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mesa #{selectedTable?.number}</DialogTitle>
          <DialogDescription>
            Status atual: <span className="font-medium capitalize">{selectedTable?.status}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Alterar Status</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => onTableAction("ocupar")}
                disabled={selectedTable?.status === "ocupada"}
              >
                Ocupar
              </Button>
              <Button
                variant="outline"
                onClick={() => onTableAction("reservar")}
                disabled={selectedTable?.status === "reservada"}
              >
                Reservar
              </Button>
              <Button
                variant="outline"
                onClick={() => onTableAction("liberar")}
                disabled={selectedTable?.status === "disponível"}
              >
                Liberar
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Opções</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">Editar Mesa</Button>
              <Button 
                variant="destructive"
                onClick={onRemoveTable}
              >
                Excluir Mesa
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Ações Rápidas</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button>Criar Pedido</Button>
              <Button>Ver Pedidos</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableActionDialog;
