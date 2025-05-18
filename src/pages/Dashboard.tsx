import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CalendarDays, Package, Receipt, Table, Users } from "lucide-react";
import api from "../services/api";

const DashboardCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    orders: 0,
    ordersChange: 0,
    occupiedTables: 0,
    totalTables: 0,
    reservationsToday: 0,
    nextReservation: "",
    rentedItems: 0,
    pendingDeliveries: 0,
    activeCustomers: 0,
    customersChange: 0,
    dailyRevenue: 0,
    dailyRevenueChange: 0
  });
  const [recentOrders, setRecentOrders] = useState([]); // [{id, table, customer, total, status, created_at}]
  const [recentRentals, setRecentRentals] = useState([]); // [{id, client, eventType, date, totalValue, status}]

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Substitua pelos endpoints reais do backend
        const [statsRes, ordersRes, rentalsRes] = await Promise.all([
          api.get("/api/dashboard/stats"),
          api.get("/api/dashboard/recent-orders"),
          api.get("/api/dashboard/recent-rentals")
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
        setRecentRentals(rentalsRes.data);
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo, {user?.name}! Aqui está um resumo do seu sistema.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Pedidos"
          value={stats.orders.toString()}
          description={stats.ordersChange > 0 ? `+${stats.ordersChange} desde a última hora` : `${stats.ordersChange} desde a última hora`}
          icon={Receipt}
        />
        <DashboardCard
          title="Mesas Ocupadas"
          value={`${stats.occupiedTables}/${stats.totalTables}`}
          description={`${stats.totalTables > 0 ? Math.round((stats.occupiedTables / stats.totalTables) * 100) : 0}% de ocupação`}
          icon={Table}
        />
        <DashboardCard
          title="Reservas Hoje"
          value={stats.reservationsToday.toString()}
          description={stats.nextReservation ? `Próxima em ${stats.nextReservation}` : "Sem próximas reservas"}
          icon={CalendarDays}
        />
        <DashboardCard
          title="Itens Locados"
          value={stats.rentedItems.toString()}
          description={`${stats.pendingDeliveries} entregas pendentes`}
          icon={Package}
        />
        <DashboardCard
          title="Clientes Ativos"
          value={stats.activeCustomers.toString()}
          description={stats.customersChange > 0 ? `+${stats.customersChange} esta semana` : `${stats.customersChange} esta semana`}
          icon={Users}
        />
        <DashboardCard
          title="Faturamento Diário"
          value={`R$ ${stats.dailyRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          description={stats.dailyRevenueChange > 0 ? `+${stats.dailyRevenueChange}% em relação à média` : `${stats.dailyRevenueChange}% em relação à média`}
          icon={BarChart}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Lista dos últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.length === 0 ? (
                <div className="text-muted-foreground text-center">Nenhum pedido recente</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b py-2">
                    <span>Mesa #{order.table_number ? order.table_number : 'N/A'} - {order.customer}</span>
                    <span className="font-semibold">R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs text-muted-foreground">{order.status}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Locações Recentes</CardTitle>
            <CardDescription>Lista das últimas locações de itens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRentals.length === 0 ? (
                <div className="text-muted-foreground text-center">Nenhuma locação recente</div>
              ) : (
                recentRentals.map((rental) => (
                  <div key={rental.id} className="flex justify-between items-center border-b py-2">
                    <span>{rental.client} - {rental.eventType}</span>
                    <span className="font-semibold">R$ {rental.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs text-muted-foreground">{rental.status}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
