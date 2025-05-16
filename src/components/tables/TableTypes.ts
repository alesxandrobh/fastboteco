export type TableStatus = "disponível" | "ocupada" | "reservada";

export interface TableData {
  id: number;
  number: number;
  seats: number;
  status: TableStatus;
}

export const getTableColorClass = (status: TableStatus): string => {
  switch (status) {
    case "ocupada":
      return "table-occupied";
    case "reservada":
      return "table-reserved";
    default:
      return "table-available";
  }
};
