-- Schema para Project Hub v2 no Supabase

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'ANALISTA',
  area TEXT DEFAULT 'Operações',
  avatar_gradient TEXT,
  initials TEXT,
  is_online BOOLEAN DEFAULT false,
  last_active TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Grupos de Projetos
CREATE TABLE IF NOT EXISTS public.project_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES public.project_groups(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'EM ANDAMENTO',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  owner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Tarefas / Entregáveis
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assignee TEXT,
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  priority TEXT DEFAULT 'Média',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela da Wiki Corporativa
CREATE TABLE IF NOT EXISTS public.wiki_pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  content TEXT,
  author TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (opcional para leitura pública e escrita autenticada)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso permissivas para demonstracao
CREATE POLICY "Permitir leitura pública" ON public.users FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública em grupos" ON public.project_groups FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública em projetos" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública em tarefas" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública na wiki" ON public.wiki_pages FOR SELECT USING (true);
