import { createSlice } from '@reduxjs/toolkit';

const mockUsers = [
  {
    id: 'u_admin',
    name: 'Alex Low (Admin)',
    email: 'admin@empresa.com',
    password: 'admin',
    role: 'ADMIN',
    area: 'PMO & Governança',
    avatarGradient: 'from-purple-600 to-indigo-700',
    initials: 'AD',
    isOnline: true,
    lastActive: 'Online agora'
  },
  {
    id: 'u_gestor',
    name: 'Claudia (Gestora)',
    email: 'claudia@empresa.com',
    password: 'gestor',
    role: 'GESTOR',
    area: 'Corporate',
    avatarGradient: 'from-blue-600 to-indigo-600',
    initials: 'CL',
    isOnline: true,
    lastActive: 'Online agora'
  },
  {
    id: 'u_analista',
    name: 'Bruno (Analista)',
    email: 'bruno@empresa.com',
    password: 'analista',
    role: 'ANALISTA',
    area: 'CTI & Operações',
    avatarGradient: 'from-emerald-600 to-teal-600',
    initials: 'BR',
    isOnline: false,
    lastActive: 'Ativo há 15 min'
  },
  {
    id: 'u_viewer',
    name: 'Visitante (Viewer)',
    email: 'viewer@empresa.com',
    password: 'viewer',
    role: 'VIEWER',
    area: 'Consultoria Externa',
    avatarGradient: 'from-amber-500 to-orange-600',
    initials: 'VW',
    isOnline: false,
    lastActive: 'Ativo há 2h'
  },
  {
    id: 'u_amanda',
    name: 'Amanda Marques',
    email: 'Amanda.JesusDelphini@br.luxottica.com',
    password: 'Essilorlux@2026',
    role: 'ANALISTA',
    area: 'Operações Luxottica',
    avatarGradient: 'from-emerald-600 to-teal-600',
    initials: 'AM',
    isOnline: true,
    lastActive: 'Online agora'
  },
  {
    id: 'u_mariaclara',
    name: 'Maria Clara',
    email: 'MariaClara.Acciari@luxottica.com',
    password: 'Essilorlux@2026',
    role: 'ANALISTA',
    area: 'Operações Luxottica',
    avatarGradient: 'from-teal-600 to-emerald-600',
    initials: 'MC',
    isOnline: true,
    lastActive: 'Online agora'
  },
  {
    id: 'u_gabriel',
    name: 'Gabriel Pequeno',
    email: 'Gabriel.PDaSilva@br.luxottica.com',
    password: 'Essilorlux@2026',
    role: 'ANALISTA',
    area: 'Operações Luxottica',
    avatarGradient: 'from-cyan-600 to-teal-600',
    initials: 'GP',
    isOnline: true,
    lastActive: 'Online agora'
  },
  {
    id: 'u_isabelle',
    name: 'Isabelle Rodrigues',
    email: 'Isabelle.Rodrigues@br.luxottica.com',
    password: 'Essilorlux@2026',
    role: 'GESTOR',
    area: 'Gestão Luxottica',
    avatarGradient: 'from-blue-600 to-indigo-600',
    initials: 'IR',
    isOnline: true,
    lastActive: 'Online agora'
  },
  {
    id: 'u_samara',
    name: 'Samara Trindade',
    email: 'Samara.Trindade@br.luxottica.com',
    password: 'Essilorlux@2026',
    role: 'ANALISTA',
    area: 'Operações Luxottica',
    avatarGradient: 'from-emerald-600 to-cyan-600',
    initials: 'ST',
    isOnline: true,
    lastActive: 'Online agora'
  }
];

const getInitialUsers = () => {
  try {
    const savedAvailable = JSON.parse(localStorage.getItem('hub_available_users'));
    if (!savedAvailable || !Array.isArray(savedAvailable) || savedAvailable.length === 0) {
      return mockUsers;
    }
    const merged = [...savedAvailable];
    mockUsers.forEach(mUser => {
      if (!merged.some(u => u.email.toLowerCase() === mUser.email.toLowerCase())) {
        merged.push(mUser);
      }
    });
    localStorage.setItem('hub_available_users', JSON.stringify(merged));
    return merged;
  } catch (e) {
    return mockUsers;
  }
};

const initialAvailable = getInitialUsers();
const savedUser = JSON.parse(localStorage.getItem('hub_user')) || initialAvailable[0];

const initialState = {
  user: savedUser,
  isAuthenticated: true,
  availableUsers: initialAvailable
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      let foundUser = state.availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        foundUser.isOnline = true;
        foundUser.lastActive = 'Online agora';
      } else {
        foundUser = {
          id: 'u_' + Date.now(),
          name: email.split('@')[0],
          email,
          password: password || 'Essilorlux@2026',
          role: 'ANALISTA',
          area: 'Operações Luxottica',
          avatarGradient: 'from-blue-600 to-indigo-600',
          initials: email.slice(0, 2).toUpperCase(),
          isOnline: true,
          lastActive: 'Online agora'
        };
        state.availableUsers.push(foundUser);
      }

      state.user = foundUser;
      state.isAuthenticated = true;
      localStorage.setItem('hub_user', JSON.stringify(foundUser));
      localStorage.setItem('hub_available_users', JSON.stringify(state.availableUsers));
    },
    switchRoleUser: (state, action) => {
      const targetUser = state.availableUsers.find(u => u.id === action.payload);
      if (targetUser) {
        targetUser.isOnline = true;
        targetUser.lastActive = 'Online agora';
        state.user = targetUser;
        state.isAuthenticated = true;
        localStorage.setItem('hub_user', JSON.stringify(targetUser));
        localStorage.setItem('hub_available_users', JSON.stringify(state.availableUsers));
      }
    },
    addUser: (state, action) => {
      const newUser = action.payload;
      state.availableUsers.push(newUser);
      localStorage.setItem('hub_available_users', JSON.stringify(state.availableUsers));
    },
    deleteUser: (state, action) => {
      const userId = action.payload;
      state.availableUsers = state.availableUsers.filter(u => u.id !== userId);
      localStorage.setItem('hub_available_users', JSON.stringify(state.availableUsers));
    },
    toggleUserOnlineStatus: (state, action) => {
      const target = state.availableUsers.find(u => u.id === action.payload);
      if (target) {
        target.isOnline = !target.isOnline;
        target.lastActive = target.isOnline ? 'Online agora' : 'Desconectado recentemente';
        localStorage.setItem('hub_available_users', JSON.stringify(state.availableUsers));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('hub_user');
    }
  }
});

export const { login, switchRoleUser, addUser, deleteUser, toggleUserOnlineStatus, logout } = authSlice.actions;
export default authSlice.reducer;
