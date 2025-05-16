import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Store, CreditCard, Lock, Mail } from "lucide-react";
import { DatabaseTest } from "@/components/DatabaseTest";

const Settings = () => {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerenciar configurações do sistema</p>
      </div>

      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="restaurant">Restaurante</TabsTrigger>
          <TabsTrigger value="rental">Locação</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="restaurant" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Restaurante</CardTitle>
              <CardDescription>Informações gerais do restaurante e bar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="restaurant-name">Nome do Restaurante</Label>
                  <input
                    id="restaurant-name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="BarFesta Restaurante & Bar"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="opening-hours">Horário de Funcionamento</Label>
                  <input
                    id="opening-hours"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="Segunda a Sábado: 18:00 - 00:00, Domingo: 12:00 - 22:00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Endereço</Label>
                  <textarea
                    id="address"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                    defaultValue="Av. Paulista, 1000, São Paulo - SP, 01310-100"
                  ></textarea>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Telefone de Contato</Label>
                  <input
                    id="contact"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="(11) 5555-1234"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="table-limit">Limite de Mesas</Label>
                  <input
                    id="table-limit"
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="20"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Reservas</CardTitle>
              <CardDescription>Defina como as reservas funcionam no restaurante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-reservations">Permitir Reservas</Label>
                  <div className="flex items-center h-4">
                    <input
                      id="allow-reservations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reservation-notice">Aviso Prévio para Reservas (horas)</Label>
                  <input
                    id="reservation-notice"
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="24"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-reservation-size">Tamanho Máximo por Reserva</Label>
                  <input
                    id="max-reservation-size"
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="12"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="rental" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Locação</CardTitle>
              <CardDescription>Informações sobre o serviço de locação de itens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rental-name">Nome do Serviço de Locação</Label>
                  <input
                    id="rental-name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="BarFesta Locação para Eventos"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rental-description">Descrição do Serviço</Label>
                  <textarea
                    id="rental-description"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                    defaultValue="Serviço de locação de mesas, cadeiras, louças e utensílios para eventos."
                  ></textarea>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rental-notice">Aviso Prévio para Locações (dias)</Label>
                  <input
                    id="rental-notice"
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="7"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deposit-percentage">Porcentagem de Depósito</Label>
                  <input
                    id="deposit-percentage"
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="30"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Locação</CardTitle>
              <CardDescription>Defina as políticas para o serviço de locação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cancellation-policy">Política de Cancelamento</Label>
                  <textarea
                    id="cancellation-policy"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                    defaultValue="Cancelamentos com até 72 horas de antecedência recebem reembolso integral do depósito. Cancelamentos com menos de 72 horas de antecedência não são reembolsáveis."
                  ></textarea>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="damage-policy">Política de Danos</Label>
                  <textarea
                    id="damage-policy"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                    defaultValue="Itens danificados serão cobrados pelo valor de reposição. Uma inspeção será realizada na devolução dos itens."
                  ></textarea>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Usuários</CardTitle>
              <CardDescription>Gerenciar configurações de usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-registration">Permitir Novos Registros</Label>
                  <div className="flex items-center h-4">
                    <input
                      id="allow-registration"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-approval">Exigir Aprovação do Admin</Label>
                  <div className="flex items-center h-4">
                    <input
                      id="require-approval"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-min-length">Tamanho Mínimo de Senha</Label>
                  <input
                    id="password-min-length"
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="8"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-special-chars">Exigir Caracteres Especiais</Label>
                  <div className="flex items-center h-4">
                    <input
                      id="require-special-chars"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>Gerenciar métodos de pagamento e integrações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} />
                    <Label>Cartão de Crédito</Label>
                  </div>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Dinheiro</Label>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>PIX</Label>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Transferência Bancária</Label>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pix-key">Chave PIX</Label>
                  <input
                    id="pix-key"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="12345678900"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configurações gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="system-email">Email do Sistema</Label>
                  <input
                    id="system-email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="sistema@barfesta.com"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-notifications">Habilitar Notificações por Email</Label>
                  <div className="flex items-center h-4">
                    <input
                      id="enable-notifications"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <select
                    id="timezone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="America/Sao_Paulo">América/São Paulo</option>
                    <option value="America/New_York">América/Nova Iorque</option>
                    <option value="Europe/London">Europa/Londres</option>
                    <option value="Europe/Paris">Europa/Paris</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês (EUA)</option>
                    <option value="es">Espanhol</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                  <select
                    id="backup-frequency"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Teste de Conexão com o Banco de Dados</CardTitle>
              <CardDescription>Verifique se o sistema está conectado corretamente ao banco de dados configurado.</CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseTest />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
