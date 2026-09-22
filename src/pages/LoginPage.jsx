import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { login, switchRoleUser } from '../features/authSlice';
import luxImage from '../assets/lux.png';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { availableUsers } = useSelector(state => state.auth);

  const [email, setEmail] = useState('admin@empresa.com');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor digite um e-mail válido.');
      return;
    }
    dispatch(login({ email, password }));
    navigate('/');
  };

  const handleQuickLogin = (userId) => {
    dispatch(switchRoleUser(userId));
    navigate('/');
  };

  const getRoleTheme = (role) => {
    switch (role) {
      case 'ADMIN':
        return { avatarBg: 'bg-purple-600 text-white', tagColor: 'text-purple-600 dark:text-purple-400' };
      case 'GESTOR':
        return { avatarBg: 'bg-blue-600 text-white', tagColor: 'text-blue-600 dark:text-blue-400' };
      case 'ANALISTA':
        return { avatarBg: 'bg-emerald-600 text-white', tagColor: 'text-emerald-600 dark:text-emerald-400' };
      default:
        return { avatarBg: 'bg-amber-600 text-white', tagColor: 'text-amber-600 dark:text-amber-400' };
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] dark:bg-zinc-950 text-gray-900 dark:text-white flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Editorial Stage Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT COLUMN: Main Form & Role Selection */}
        <div className="p-8 md:p-11 flex flex-col justify-center">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Hub de Projetos Logo" className="w-10 h-10 rounded-xl object-cover shadow-md" />
            <div>
              <b className="text-base font-bold tracking-tight text-gray-900 dark:text-white block leading-snug">
                Hub de Projetos
              </b>
              <span className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 block mt-0.5">
                Portal corporativo de gestão de projetos.
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
            Bem-vindo de volta
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed">
            Entre com suas credenciais ou escolha um perfil de teste.
          </p>

          {/* Login Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                E-mail corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                className="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-gray-50/80 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition font-medium"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-zinc-400 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 dark:border-zinc-700 accent-indigo-600"
                />
                Manter conectado
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Esqueci minha senha
              </a>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition active:scale-[0.99]"
            >
              Entrar no sistema
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
            <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">
              ou entre com um perfil de teste
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
          </div>

          {/* Quick Demo Access Roles Grid (Somente usuários de teste) */}
          <div className="grid grid-cols-2 gap-2.5">
            {availableUsers
              .filter(u => ['u_admin', 'u_gestor', 'u_analista', 'u_viewer'].includes(u.id) || u.email.includes('@empresa.com'))
              .map((u) => {
                const theme = getRoleTheme(u.role);
                return (
                  <div
                    key={u.id}
                    onClick={() => handleQuickLogin(u.id)}
                    className="flex items-center gap-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl p-2.5 bg-gray-50/80 dark:bg-zinc-800/40 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition cursor-pointer group"
                    title={`Perfil de Teste: ${u.name} (${u.role})`}
                  >
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold ${theme.avatarBg}`}>
                      {u.initials}
                    </div>
                    <div className="truncate min-w-0">
                      <b className="block text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {u.name.split(' ')[0]}
                      </b>
                      <span className={`text-[10px] font-extrabold tracking-wider ${theme.tagColor}`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>

        {/* RIGHT COLUMN: Editorial Quote Panel with lux.png (Quote at bottom) */}
        <div 
          className="hidden md:flex flex-col justify-end p-11 text-white relative overflow-hidden bg-cover bg-center min-h-[520px]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(17,24,39,0.15) 0%, rgba(17,24,39,0.85) 100%), url(${luxImage})`
          }}
        >
          {/* Quote at Bottom */}
          <div className="relative z-10 max-w-sm">
            <blockquote className="text-2xl font-bold leading-snug tracking-tight drop-shadow-lg text-white/95">
              "Tu te tornas eternamente responsável por aquilo que implementas."
            </blockquote>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;

