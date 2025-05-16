
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableData } from "./TableTypes";
import { toast } from "sonner";

interface AddTableDialogProps {
  tables: TableData[];
  onAddTable: (number: number, seats: number) => void;
}

const AddTableDialog = ({ tables, onAddTable }: AddTableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [newTableSeats, setNewTableSeats] = useState("");

  const handleAddTable = () => {
    const number = parseInt(newTableNumber);
    const seats = parseInt(newTableSeats);
    
    if (isNaN(number) || isNaN(seats) || number <= 0 || seats <= 0) {
      toast.error("Por favor, insira valores válidos para número e lugares.");
      return;
    }
    
    // Check if table number already exists
    if (tables.some(table => table.number === number)) {
      toast.error(`Mesa #${number} já existe.`);
      return;
    }
    
    onAddTable(number, seats);
    setNewTableNumber("");
    setNewTableSeats("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Mesa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Mesa</DialogTitle>
          <DialogDescription>Preencha os detalhes para adicionar uma nova mesa.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">Número</Label>
            <Input
              id="number"
              type="number"
              min="1"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="seats" className="text-right">Lugares</Label>
            <Input
              id="seats"
              type="number"
              min="1"
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddTable}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableDialog;
