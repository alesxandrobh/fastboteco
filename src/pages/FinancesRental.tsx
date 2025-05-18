import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "#22c55e",
  },
  expenses: {
    label: "Despesas",
    color: "#ef4444", 
  },
  profit: {
    label: "Lucro",
    
    color: "#3b82f6",
  },
};

const FinancesRental = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0, revenueChange: 0, expensesChange: 0, profitChange: 0 });
  const [monthlyData, setMonthlyData] = useState([]); // [{ name, revenue, expenses, profit }]
  const [revenueByEventType, setRevenueByEventType] = useState([]); // [{ name, value }]
  const [recentTransactions, setRecentTransactions] = useState([]); // [{ id, date, description, amount, type, client, eventType }]

  useEffect(() => {
    const fetchFinanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Substitua pelos endpoints reais quando disponíveis
        const [summaryRes, monthlyRes, eventTypeRes, transactionsRes] = await Promise.all([
          api.get("/api/rental/finance/summary"),
          api.get("/api/rental/finance/monthly"),
          api.get("/api/rental/finance/event-type"),
          api.get("/api/rental/finance/transactions")
        ]);
        setSummary(summaryRes.data);
        setMonthlyData(monthlyRes.data);
        setRevenueByEventType(eventTypeRes.data);
        setRecentTransactions(transactionsRes.data);
      } catch (err) {
        setError("Erro ao carregar dados financeiros da locação");
      } finally {
        setLoading(false);
      }
    };
    fetchFinanceData();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando dados financeiros...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro - Locação de Itens</h1>
        <p className="text-muted-foreground">Gerenciamento financeiro de locação de itens para eventos</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {summary.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">{summary.revenueChange > 0 ? `+${summary.revenueChange}%` : `${summary.revenueChange}%`} em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {summary.expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">{summary.expensesChange > 0 ? `+${summary.expensesChange}%` : `${summary.expensesChange}%`} em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {summary.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">{summary.profitChange > 0 ? `+${summary.profitChange}%` : `${summary.profitChange}%`} em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho Financeiro Mensal</CardTitle>
                <CardDescription>Acompanhamento da receita, despesas e lucro nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#22c55e" name="Receita" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Despesas" />
                      <Bar dataKey="profit" fill="#3b82f6" name="Lucro" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Tipo de Evento</CardTitle>
                <CardDescription>Distribuição percentual da receita por tipo de evento</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByEventType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByEventType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas movimentações financeiras relacionadas à locação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-12 px-4 text-left font-medium">Data</th>
                      <th className="h-12 px-4 text-left font-medium">Descrição</th>
                      <th className="h-12 px-4 text-right font-medium">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-4">{transaction.date}</td>
                        <td className="p-4">
                          {transaction.client 
                            ? `Locação - ${transaction.client} (${transaction.eventType})` 
                            : transaction.description}
                        </td>
                        <td className={`p-4 text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} R$ {Number(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>Acesse os relatórios financeiros de locação de itens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório Mensal</h3>
                  <p className="text-sm text-muted-foreground mb-4">Visão detalhada das finanças do último mês</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório por Tipo de Evento</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análise financeira separada por categoria de evento</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório de Manutenção</h3>
                  <p className="text-sm text-muted-foreground mb-4">Custos de manutenção e reposição de itens</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Previsão de Receita</h3>
                  <p className="text-sm text-muted-foreground mb-4">Previsão de receita para os próximos meses</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancesRental;
