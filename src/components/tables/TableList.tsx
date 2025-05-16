
import React from "react";
import TableCard from "./TableCard";
import { TableData } from "./TableTypes";

interface TableListProps {
  tables: TableData[];
  onTableSelect: (table: TableData) => void;
}

const TableList = ({ tables, onTableSelect }: TableListProps) => {
  if (tables.length === 0) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-md">
        <p className="text-muted-foreground">Nenhuma mesa encontrada com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-1 mx-[-2px]">
      {tables.map((table) => (
        <TableCard 
          key={table.id} 
          table={table} 
          onClick={onTableSelect} 
        />
      ))}
    </div>
  );
};

export default TableList;
