
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableStatus } from "./TableTypes";

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TableStatus | "all";
  onStatusFilterChange: (status: TableStatus | "all") => void;
  seatsFilter: number | null;
  onSeatsFilterChange: (seats: number | null) => void;
}

const TableFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  seatsFilter,
  onSeatsFilterChange,
}: TableFiltersProps) => {
  const statusOptions: Array<{ value: TableStatus | "all"; label: string }> = [
    { value: "all", label: "Todos" },
    { value: "disponível", label: "Disponível" },
    { value: "ocupada", label: "Ocupada" },
    { value: "reservada", label: "Reservada" },
  ];

  const seatsOptions = [null, 2, 4, 6, 8];

  return (
    <div className="flex flex-col gap-2 mb-4 md:flex-row md:gap-4 md:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por número da mesa..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="space-x-1">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={statusFilter === option.value ? "default" : "outline"}
              onClick={() => onStatusFilterChange(option.value)}
              className="mb-1"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="space-x-1">
          {seatsOptions.map((seats) => (
            <Button
              key={seats || "all"}
              size="sm"
              variant={seatsFilter === seats ? "default" : "outline"}
              onClick={() => onSeatsFilterChange(seats)}
              className="mb-1"
            >
              {seats ? `${seats} lugares` : "Todos"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
