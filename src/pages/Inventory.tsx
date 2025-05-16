import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, AlertTriangle, Plus } from "lucide-react";
import api from "../services/api";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("restaurant");
  const [products, setProducts] = useState([]); // All products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        // TODO: tratamento de erro global
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estoque</h1>
        <p className="text-muted-foreground">Gerenciamento de estoque do restaurante e itens para locação</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Itens em Estoque</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="restaurant">Restaurante & Bar</TabsTrigger>
          <TabsTrigger value="rental">Itens para Locação</TabsTrigger>
        </TabsList>
        {/* Restaurante & Bar */}
        <TabsContent value="restaurant">
          <Card>
            <CardHeader>
              <CardTitle>Inventário do Restaurante</CardTitle>
              <CardDescription>Estoque de alimentos, bebidas e descartáveis</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="p-6 text-center text-muted-foreground">Carregando itens...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.filter((p) => !p.is_rental).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category_id}</TableCell>
                        <TableCell>R$ {item.price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass("ok")}`}>Normal</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Itens para Locação */}
        <TabsContent value="rental">
          <Card>
            <CardHeader>
              <CardTitle>Inventário de Itens para Locação</CardTitle>
              <CardDescription>Controle de itens disponíveis para aluguel</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="p-6 text-center text-muted-foreground">Carregando itens...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.filter((p) => p.is_rental).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category_id}</TableCell>
                        <TableCell>R$ {item.price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass("ok")}`}>Normal</span>
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
    </div>
  );
};

export default Inventory;
