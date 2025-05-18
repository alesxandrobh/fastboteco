
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const monthlyData = [
  { name: "Jan", revenue: 4500, expenses: 3200, profit: 1300 },
  { name: "Fev", revenue: 5200, expenses: 3800, profit: 1400 },
  { name: "Mar", revenue: 6100, expenses: 4200, profit: 1900 },
  { name: "Abr", revenue: 5800, expenses: 4000, profit: 1800 },
  { name: "Mai", revenue: 7200, expenses: 4500, profit: 2700 },
  { name: "Jun", revenue: 8400, expenses: 5100, profit: 3300 },
];

const dailyData = [
  { name: "Seg", revenue: 780, expenses: 540, profit: 240 },
  { name: "Ter", revenue: 920, expenses: 610, profit: 310 },
  { name: "Qua", revenue: 830, expenses: 590, profit: 240 },
  { name: "Qui", revenue: 960, expenses: 680, profit: 280 },
  { name: "Sex", revenue: 1250, expenses: 820, profit: 430 },
  { name: "Sáb", revenue: 1450, expenses: 870, profit: 580 },
  { name: "Dom", revenue: 1100, expenses: 720, profit: 380 },
];

const recentTransactions = [
  { id: 1, date: "15/05/2023", description: "Venda - Mesa 12", amount: 324.90, type: "income" },
  { id: 2, date: "15/05/2023", description: "Compra de insumos", amount: 1250.45, type: "expense" },
  { id: 3, date: "14/05/2023", description: "Venda - Mesa 5", amount: 187.50, type: "income" },
  { id: 4, date: "14/05/2023", description: "Pagamento Funcionário", amount: 1800.00, type: "expense" },
  { id: 5, date: "13/05/2023", description: "Venda - Mesa 8", amount: 256.75, type: "income" },
];

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

const FinancesRestaurant = () => {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro - Restaurante & Bar</h1>
        <p className="text-muted-foreground">Gerenciamento financeiro do restaurante e bar</p>
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
                <div className="text-2xl font-bold">R$ 32.450,00</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 18.650,00</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 13.800,00</div>
                <p className="text-xs text-muted-foreground">+25% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho Financeiro Mensal</CardTitle>
              <CardDescription>Acompanhamento da receita, despesas e lucro nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-[700px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="50%" height="50%">
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
              <CardTitle>Desempenho Semanal</CardTitle>
              <CardDescription>Resultados por dia da semana atual</CardDescription>
            </CardHeader>
            <CardContent className="h-[700px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="10%" height="10%">
                  <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Receita" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Despesas" />
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="Lucro" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas movimentações financeiras</CardDescription>
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
                        <td className="p-4">{transaction.description}</td>
                        <td className={`p-4 text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
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
              <CardDescription>Acesse os relatórios financeiros do restaurante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório Mensal</h3>
                  <p className="text-sm text-muted-foreground mb-4">Visão detalhada das finanças do último mês</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório Trimestral</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análise dos últimos 3 meses de operação</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório de Vendas por Categoria</h3>
                  <p className="text-sm text-muted-foreground mb-4">Desempenho por tipo de produto</p>
                  <button className="text-sm text-primary hover:underline">Download PDF</button>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="font-semibold">Relatório de Custos</h3>
                  <p className="text-sm text-muted-foreground mb-4">Análise detalhada de despesas</p>
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

export default FinancesRestaurant;
