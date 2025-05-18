import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Calendar, Plus } from "lucide-react";
import api from "../services/api";
import { Rental } from "@/types";

const Rentals = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [rentalOrders, setRentalOrders] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/rentals");
        // Ajuste: garantir compatibilidade de campos
        const rentals = response.data.map((order: any) => ({
          ...order,
          status: (order.status === 'confirmado' ? 'confirmed' : order.status === 'pendente' ? 'pending' : (order.status || '')),
          totalValue: Number(order.totalValue || order.total || 0),
          client: order.client || order.customer || 'Desconhecido',
          eventType: order.eventType || order.notes || '',
          date: order.date || order.event_date || '',
        })) as Rental[];
        console.log('Locações carregadas:', rentals);
        setRentalOrders(rentals);
      } catch (err) {
        setError("Erro ao carregar locações do banco de dados");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const upcomingEvents = rentalOrders.filter(order => {
    const eventDate = new Date(order.date.split("/").reverse().join("-"));
    return eventDate >= new Date();
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Confirmado</span>;
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando locações...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Locações</h1>
        <p className="text-muted-foreground">Gerenciamento de locação de itens para eventos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Locações Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentalOrders.filter(order => order.status === "confirmed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Locações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentalOrders.filter(order => order.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Prevista</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {rentalOrders.reduce((acc, order) => acc + order.totalValue, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Solicitações de Locação</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Locação
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Locações Ativas</CardTitle>
              <CardDescription>Solicitações confirmadas e pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentalOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.client}</TableCell>
                      <TableCell>{order.eventType}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>R$ {order.totalValue.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Eventos com data futura</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEvents.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.client}</TableCell>
                      <TableCell>{order.eventType}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>R$ {order.totalValue.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Locações</CardTitle>
              <CardDescription>Histórico completo de locações</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentalOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.client}</TableCell>
                      <TableCell>{order.eventType}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>R$ {order.totalValue.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rentals;
