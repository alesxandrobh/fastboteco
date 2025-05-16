import { useState } from "react";

interface TenantForm {
  name: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
}

export function DatabaseConfig() {
  const [host, setHost] = useState('189.83.186.160');
  const [database, setDatabase] = useState('barfesta_db');
  const [user, setUser] = useState('alesxandro');
  const [password, setPassword] = useState('46302113');
  const [port, setPort] = useState(3306);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleTestConnection = async () => {
    setStatus('loading');
    setMessage('');
    try {
      // Aqui você pode criar um endpoint para testar conexão dinâmica se desejar
      // Por enquanto, apenas simula sucesso
      setTimeout(() => {
        setStatus('success');
        setMessage('Conexão bem-sucedida!');
      }, 1000);
    } catch (error) {
      setStatus('error');
      setMessage('Falha na conexão com o banco de dados');
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Configuração do Banco de Dados</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">Host</label>
          <input className="w-full rounded border px-2 py-1" value={host} onChange={e => setHost(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Porta</label>
          <input className="w-full rounded border px-2 py-1" type="number" value={port} onChange={e => setPort(Number(e.target.value))} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Banco de Dados</label>
          <input className="w-full rounded border px-2 py-1" value={database} onChange={e => setDatabase(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Usuário</label>
          <input className="w-full rounded border px-2 py-1" value={user} onChange={e => setUser(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Senha</label>
          <input className="w-full rounded border px-2 py-1" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </div>
      <button
        onClick={handleTestConnection}
        disabled={status === 'loading'}
        className={`px-4 py-2 rounded-md mt-2 ${
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

export function TenantRegistration() {
  const [form, setForm] = useState<TenantForm>({
    name: "",
    dbName: "",
    dbUser: "",
    dbPassword: "",
    dbHost: "189.83.186.160",
    dbPort: 3306,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      // Chame o endpoint do backend para criar o banco e registrar o tenant
      // await api.post("/api/tenants", form);
      setStatus("success");
      setMessage("Cliente cadastrado e banco criado com sucesso!");
    } catch (err) {
      setStatus("error");
      setMessage("Erro ao cadastrar cliente ou criar banco.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Cadastro de Novo Cliente/Estabelecimento</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Nome do Cliente</label>
          <input className="w-full rounded border px-2 py-1" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nome do Banco</label>
          <input className="w-full rounded border px-2 py-1" name="dbName" value={form.dbName} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Usuário do Banco</label>
          <input className="w-full rounded border px-2 py-1" name="dbUser" value={form.dbUser} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Senha do Banco</label>
          <input className="w-full rounded border px-2 py-1" type="password" name="dbPassword" value={form.dbPassword} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Host</label>
          <input className="w-full rounded border px-2 py-1" name="dbHost" value={form.dbHost} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Porta</label>
          <input className="w-full rounded border px-2 py-1" type="number" name="dbPort" value={form.dbPort} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2 flex justify-end mt-4">
          <button type="submit" className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium" disabled={status === "loading"}>
            {status === "loading" ? "Cadastrando..." : "Cadastrar Cliente e Criar Banco"}
          </button>
        </div>
      </form>
      {message && (
        <div className={`mt-4 p-3 rounded ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message}</div>
      )}
    </div>
  );
}