import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Plus } from "lucide-react";
import api from "../services/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users");
        setEmployees(response.data);
      } catch (error) {
        // TODO: adicionar tratamento de erro global
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Filtros e contadores
  const departments = Array.from(new Set(employees.map(emp => emp.department))).map(dep => ({ name: dep, count: employees.filter(e => e.department === dep).length }));
  const filteredEmployees = selectedDepartment === "all"
    ? employees
    : employees.filter(emp => emp.department === selectedDepartment);

  // Ajuste para exibir loading e evitar erros se não houver dados
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funcionários</h1>
        <p className="text-muted-foreground">Gerenciamento de equipe e colaboradores</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Novos (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Funcionários</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Funcionário
        </Button>
      </div>
      <div className="flex space-x-4">
        <div className="bg-background rounded-lg border p-4 space-y-4 w-64">
          <h3 className="font-medium">Filtrar por Departamento</h3>
          <div className="space-y-2">
            <div 
              className={`p-2 rounded cursor-pointer ${selectedDepartment === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              onClick={() => setSelectedDepartment("all")}
            >
              Todos os Departamentos
            </div>
            {departments.map((dept) => (
              <div 
                key={dept.name}
                className={`p-2 rounded cursor-pointer flex justify-between ${selectedDepartment === dept.name ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                onClick={() => setSelectedDepartment(dept.name)}
              >
                <span>{dept.name}</span>
                <span className="bg-muted rounded-full px-2 text-xs flex items-center justify-center">
                  {dept.count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="vacation">Em Férias</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-6 text-center text-muted-foreground">Carregando funcionários...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Cargo</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead>Data de Admissão</TableHead>
                          <TableHead>Contato</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{employee.position || employee.role}</TableCell>
                            <TableCell>{employee.department || '-'}</TableCell>
                            <TableCell>{employee.startDate || employee.created_at?.split('T')[0]}</TableCell>
                            <TableCell>{employee.contact || employee.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-6 text-center text-muted-foreground">Carregando funcionários...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Cargo</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead>Data de Admissão</TableHead>
                          <TableHead>Contato</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.filter(emp => emp.active !== false).map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{employee.position || employee.role}</TableCell>
                            <TableCell>{employee.department || '-'}</TableCell>
                            <TableCell>{employee.startDate || employee.created_at?.split('T')[0]}</TableCell>
                            <TableCell>{employee.contact || employee.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="vacation" className="space-y-4 mt-4">
              <Card>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum funcionário em férias no momento
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Employees;
