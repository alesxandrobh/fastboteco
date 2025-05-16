
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Desculpe, a página que você está procurando ainda não foi implementada ou não existe.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
