import { useState } from 'react';
import { testConnection } from '../services/api';

export function DatabaseTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [connectionInfo] = useState({
    host: '192.168.100.151',
    database: 'barfesta_db',
    user: 'alesxandro'
  });

  const handleTestConnection = async () => {
    try {
      setStatus('loading');
      const response = await testConnection();
      setMessage(response.message);
      setStatus('success');
    } catch (error) {
      setMessage('Falha na conexão com o banco de dados');
      setStatus('error');
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Teste de Conexão com o Banco de Dados</h2>
      
      <div className="mb-4 text-sm">
        <p><strong>Host:</strong> {connectionInfo.host}</p>
        <p><strong>Banco:</strong> {connectionInfo.database}</p>
        <p><strong>Usuário:</strong> {connectionInfo.user}</p>
      </div>

      <button
        onClick={handleTestConnection}
        disabled={status === 'loading'}
        className={`px-4 py-2 rounded-md ${
          status === 'loading'
            ? 'bg-gray-400'
            : status === 'success'
            ? 'bg-green-500'
            : status === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500'
        } text-white font-medium`}
      >
        {status === 'loading' ? 'Testando...' : 'Testar Conexão'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
} 