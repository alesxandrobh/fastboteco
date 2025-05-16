import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Plus, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/services/api";
import { Reservation } from "@/types";

const Reservations = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/reservations");
        setReservations(response.data);
      } catch (err) {
        setError("Erro ao carregar reservas");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Filter reservations based on selected date
  const filteredReservations = reservations.filter(reservation => {
    if (!date) return true;
    const reservationDate = new Date(reservation.date);
    return reservationDate.getDate() === date.getDate() &&
           reservationDate.getMonth() === date.getMonth() &&
           reservationDate.getFullYear() === date.getFullYear();
  });

  const pendingReservations = filteredReservations.filter(r => r.status === "pendente");
  const confirmedReservations = filteredReservations.filter(r => r.status === "confirmada");

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando reservas...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Reserva
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Calendário
            </CardTitle>
            <CardDescription>
              Selecione uma data para ver as reservas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Reservas para {date ? format(date, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Hoje"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming" className="relative">
                  Pendentes
                  {pendingReservations.length > 0 && (
                    <Badge className="ml-2 absolute -top-2 -right-2 bg-yellow-500">{pendingReservations.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4 mt-4">
                {pendingReservations.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Não há reservas pendentes para esta data
                  </div>
                ) : (
                  pendingReservations.map(reservation => (
                    <ReservationItem 
                      key={reservation.id} 
                      reservation={reservation} 
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="confirmed" className="space-y-4 mt-4">
                {confirmedReservations.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    Não há reservas confirmadas para esta data
                  </div>
                ) : (
                  confirmedReservations.map(reservation => (
                    <ReservationItem 
                      key={reservation.id} 
                      reservation={reservation} 
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Reservation item component
const ReservationItem = ({ reservation }: { reservation: Reservation }) => {
  const { name, date, people, table, status, contact } = reservation;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border gap-4">
      <div className="space-y-1">
        <h3 className="font-medium text-base">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {format(date, "HH:mm")} · {people} pessoas · Mesa {table}
        </p>
        <p className="text-xs text-muted-foreground">{contact}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(status)}>
          {status === "confirmada" ? "Confirmada" : "Pendente"}
        </Badge>
        {status === "pendente" && (
          <>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Reservations;
