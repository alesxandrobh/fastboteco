import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChefHat, CookingPot, Clock } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import api from "../services/api";
import { Order, OrderItem } from "@/features/orders/types";

const Kitchen = () => {
  const { user } = useAuth();
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKitchenOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Busca pedidos em preparo na cozinha
        const response = await api.get("/orders?status=preparando");
        // Ajuste conforme o backend: adapte os campos se necessário
        setKitchenOrders(response.data);
      } catch (err) {
        setError("Erro ao carregar pedidos da cozinha");
      } finally {
        setLoading(false);
      }
    };
    fetchKitchenOrders();
  }, []);

  // Avançar status do pedido para "pronto" (persistência real)
  const markOrderAsReady = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: "pronto" });
      setKitchenOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      toast.success("Pedido marcado como pronto!");
    } catch (error) {
      toast.error("Erro ao marcar pedido como pronto");
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando pedidos da cozinha...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cozinha</h2>
          <p className="text-muted-foreground">
            Monitore e gerencie os pedidos em preparo na cozinha.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex gap-1 items-center">
            <ChefHat className="h-4 w-4" />
            <span>Pedidos: {kitchenOrders.length}</span>
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kitchenOrders.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <CookingPot className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Não há pedidos em preparo no momento
              </p>
              <p className="text-muted-foreground">
                Os novos pedidos aparecerão aqui para preparo.
              </p>
            </CardContent>
          </Card>
        ) : (
          kitchenOrders.map((order) => (
            <Card key={order.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Mesa #{order.table} - Pedido {order.id}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(order.timestamp).toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 rounded-lg border bg-white">
                      <div>
                        <p className="font-medium">
                          {item.quantity}x {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Valor unitário: R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Button
                    onClick={() => markOrderAsReady(order.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Marcar como Pronto
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Kitchen;
