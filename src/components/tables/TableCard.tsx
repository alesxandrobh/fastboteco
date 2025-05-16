
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableData, getTableColorClass } from "./TableTypes";

interface TableCardProps {
  table: TableData;
  onClick: (table: TableData) => void;
}

const TableCard = ({ table, onClick }: TableCardProps) => {
  return (
    <Card 
      key={table.id} 
      className={`cursor-pointer hover:shadow-lg transition-shadow small-table-card ${getTableColorClass(table.status)} mx-0.5 my-0.5`}
      onClick={() => onClick(table)}
    >
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-center text-sm">Mesa #{table.number}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-center space-y-0.5">
          <p className="text-xs">{table.seats} lugares</p>
          <p className="font-medium capitalize text-xs">{table.status}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCard;
