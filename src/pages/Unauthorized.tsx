import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Acesso Não Autorizado</h1>
        <p className="text-muted-foreground mb-8">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Voltar
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 