import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/context/useAuth";
import { Order, OrderStatus } from "@/features/orders/types";
import { KanbanColumn } from "@/features/orders/components/KanbanColumn";
import { OrderDetailsDialog } from "@/features/orders/components/OrderDetailsDialog";
import { NewOrderDialog } from "@/features/orders/components/NewOrderDialog";
import "@/features/orders/orders.css";
import api from "../services/api";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newTable, setNewTable] = useState("");
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (error) {
        setError("Erro ao carregar pedidos do banco de dados");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDragStart = (e: React.DragEvent, order: Order) => {
    e.dataTransfer.setData("orderId", order.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    
    if (!orderId) return;
    
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    toast.success(`Pedido ${orderId} movido para "${status}"`);
  };

  // Funções para criar, editar e avançar status de pedidos usando a API real
  const createOrder = async (tableNumber: number) => {
    setLoading(true);
    try {
      const response = await api.post("/orders", { table_id: tableNumber });
      setOrders((prev) => [response.data, ...prev]);
      toast.success(`Novo pedido criado para Mesa #${tableNumber}`);
    } catch (error) {
      toast.error("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  const advanceOrderStatus = async (order: Order) => {
    setLoading(true);
    try {
      // Avança o status do pedido no backend
      const response = await api.patch(`/orders/${order.id}/status`, {});
      setOrders((prev) => prev.map(o => o.id === order.id ? response.data : o));
      toast.success(`Pedido ${order.id} avançado para "${response.data.status}"`);
    } catch (error) {
      toast.error("Erro ao avançar status do pedido");
    } finally {
      setLoading(false);
    }
  };

  // Substituir handleCreateNewOrder e handleAdvanceStatus para usar as funções reais
  const handleCreateNewOrder = () => {
    const tableNumber = parseInt(newTable);
    if (isNaN(tableNumber) || tableNumber <= 0) {
      toast.error("Por favor, insira um número de mesa válido.");
      return;
    }
    createOrder(tableNumber);
    setNewTable("");
    setIsNewOrderDialogOpen(false);
  };

  const handleAdvanceStatus = (order: Order) => {
    advanceOrderStatus(order);
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando pedidos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Pedidos</h2>
          <p className="text-muted-foreground">Acompanhe e gerencie pedidos do restaurante.</p>
        </div>
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Pedido</Button>
          </DialogTrigger>
          <NewOrderDialog
            newTable={newTable}
            onTableChange={setNewTable}
            onClose={() => setIsNewOrderDialogOpen(false)}
            onCreateOrder={handleCreateNewOrder}
          />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-x-auto">
        <KanbanColumn
          title="Novos"
          status="novo"
          orders={orders}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onOrderClick={handleOrderClick}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="Preparando"
          status="preparando"
          orders={orders}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onOrderClick={handleOrderClick}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="Prontos"
          status="pronto"
          orders={orders}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onOrderClick={handleOrderClick}
          onDragStart={handleDragStart}
        />
        <KanbanColumn
          title="Entregues"
          status="entregue"
          orders={orders}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onOrderClick={handleOrderClick}
          onDragStart={handleDragStart}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedOrder && (
          <OrderDetailsDialog
            order={selectedOrder}
            onClose={() => setIsDialogOpen(false)}
            onAdvanceStatus={handleAdvanceStatus}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Orders;
