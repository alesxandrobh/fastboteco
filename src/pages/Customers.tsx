import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus } from "lucide-react";
import api from "../services/api";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  // Estado para edição
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState(null);

  // Abrir modal de edição
  const handleOpenEdit = (customer) => {
    setEditCustomerData(customer);
    setShowEditDialog(true);
  };

  // Salvar edição
  const handleEditCustomer = async (e) => {
    e.preventDefault();
    if (!editCustomerData) return;
    await editCustomer(editCustomerData.id, editCustomerData);
    setShowEditDialog(false);
    setEditCustomerData(null);
  };

  // Confirmação de deleção
  const [deletingId, setDeletingId] = useState(null);
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este cliente?')) {
      await deleteCustomer(id);
    }
  };

  // Funções de persistência real movidas para dentro do componente
  const addCustomer = async (customerData) => {
    setLoading(true);
    try {
      const response = await api.post("/api/customers", customerData);
      setCustomers((prev) => [...prev, response.data]);
      toast({ title: "Cliente cadastrado com sucesso!", variant: "default" });
    } catch (error) {
      toast({ title: "Erro ao cadastrar cliente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await api.put(`/api/customers/${id}`, updatedData);
      setCustomers((prev) => prev.map(c => c.id === id ? response.data : c));
      toast({ title: "Cliente atualizado com sucesso!", variant: "default" });
    } catch (error) {
      toast({ title: "Erro ao atualizar cliente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/customers/${id}`);
      setCustomers((prev) => prev.filter(c => c.id !== id));
      toast({ title: "Cliente removido com sucesso!", variant: "default" });
    } catch (error) {
      toast({ title: "Erro ao remover cliente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        // TODO: adicionar tratamento de erro global
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filtros e contadores
  // Ajuste: garantir compatibilidade com backend real
  const frequentCustomers = customers.filter(c => c.type === "frequent");
  const corporateCustomers = customers.filter(c => c.type === "corporate");
  const newCustomers = customers.filter(c => c.type === "new");

  const getFilteredCustomers = () => {
    let filteredList = customers;
    if (activeTab !== "all") {
      filteredList = customers.filter(c => c.type === activeTab);
    }
    if (searchTerm) {
      filteredList = filteredList.filter(c =>
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filteredList;
  };

  // Função para lidar com envio do formulário de novo cliente
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    await addCustomer(newCustomer);
    setShowAddDialog(false);
    setNewCustomer({ name: "", email: "", phone: "" });
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">Gerenciamento de clientes e histórico de relacionamento</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frequentCustomers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Corporativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{corporateCustomers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomers.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Clientes</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  required
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  type="email"
                  value={newCustomer.email}
                  onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar clientes..."
            className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="frequent">Frequentes</TabsTrigger>
          <TabsTrigger value="corporate">Corporativos</TabsTrigger>
          <TabsTrigger value="new">Novos</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center text-muted-foreground">Carregando clientes...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Visitas</TableHead>
                      <TableHead>Última Visita</TableHead>
                      <TableHead>Total Gasto</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredCustomers().map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.type}</TableCell>
                        <TableCell>{customer.phone || customer.contact}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.visits ?? '-'}</TableCell>
                        <TableCell>{customer.lastVisit ?? '-'}</TableCell>
                        <TableCell>R$ {customer.totalSpent ? customer.totalSpent.toFixed(2) : "0,00"}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleOpenEdit(customer)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(customer.id)}>
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Modal de edição de cliente */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <form onSubmit={handleEditCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                className="w-full border rounded px-2 py-1"
                required
                value={editCustomerData?.name || ""}
                onChange={e => setEditCustomerData({ ...editCustomerData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full border rounded px-2 py-1"
                type="email"
                value={editCustomerData?.email || ""}
                onChange={e => setEditCustomerData({ ...editCustomerData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={editCustomerData?.phone || ""}
                onChange={e => setEditCustomerData({ ...editCustomerData, phone: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
