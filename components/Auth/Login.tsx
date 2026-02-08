
import React, { useState } from 'react';
import { User } from '../../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Identifiant ou mot de passe incorrect.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
        <div className="p-10 pt-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-blue-200 mb-8 transform -rotate-6 transition-transform hover:rotate-0">
            🥘
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">NovaResto</h1>
          <p className="text-slate-400 font-medium mb-10">Logiciel de Gestion Professionnel</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin"
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700"
              />
            </div>

            <div className="text-left space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700"
              />
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold animate-in shake duration-300">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>SE CONNECTER</>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Accès local sécurisé • v2.5.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
