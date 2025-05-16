import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import TableList from "@/components/tables/TableList";
import TableFilters from "@/components/tables/TableFilters";
import AddTableDialog from "@/components/tables/AddTableDialog";
import TableActionDialog from "@/components/tables/TableActionDialog";
import { TableData, TableStatus } from "@/components/tables/TableTypes";
import api, { getUnits, getTables } from "../services/api";

const Tables = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TableStatus | "all">("all");
  const [seatsFilter, setSeatsFilter] = useState<number | null>(null);
  const [unitId, setUnitId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar unidades e selecionar a primeira como padrão
    const fetchUnitsAndTables = async () => {
      setLoading(true);
      setError(null);
      try {
        const units = await getUnits();
        if (units && units.length > 0) {
          setUnitId(units[0].id);
          const tablesData = await getTables(units[0].id);
          setTables(tablesData);
        }
      } catch (error) {
        setError("Erro ao carregar mesas do banco de dados");
      } finally {
        setLoading(false);
      }
    };
    fetchUnitsAndTables();
  }, []);

  // Filtros
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchesSearch = searchQuery === "" || table.number.toString().includes(searchQuery);
      const matchesStatus = statusFilter === "all" || table.status === statusFilter;
      const matchesSeats = seatsFilter === null || table.seats === seatsFilter;
      return matchesSearch && matchesStatus && matchesSeats;
    });
  }, [tables, searchQuery, statusFilter, seatsFilter]);

  // TODO: implementar handleAddTable, handleTableAction, handleRemoveTable com persistência real via API

  if (loading) return <div className="p-6 text-center text-muted-foreground">Carregando mesas...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Mesas</h2>
          <p className="text-muted-foreground text-sm">Visualize, adicione e gerencie mesas do restaurante.</p>
        </div>
        <AddTableDialog 
          tables={tables} 
          onAddTable={() => {}} // TODO: implementar
        />
      </div>
      <TableFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        seatsFilter={seatsFilter}
        onSeatsFilterChange={setSeatsFilter}
      />
      <TableList 
        tables={filteredTables} 
        onTableSelect={setSelectedTable} 
      />
      <TableActionDialog 
        isOpen={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        selectedTable={selectedTable}
        onTableAction={() => {}} // TODO: implementar
        onRemoveTable={() => {}} // TODO: implementar
      />
    </div>
  );
};

export default Tables;
