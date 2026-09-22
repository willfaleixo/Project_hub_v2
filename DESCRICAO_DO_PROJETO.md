# 🚀 Hub de Projetos v2 — Descrição e Funcionalidades

O **Hub de Projetos v2** é uma plataforma corporativa completa de **Gestão de Projetos, Portfólio (PPM) e Governança de PMO**. O sistema foi desenvolvido para proporcionar visibilidade executiva em tempo real, acompanhamento financeiro, gestão de prazos e auditoria imutável de todas as modificações realizadas nos projetos da organização.

---

## 🎯 Intuito do Projeto

O intuito principal do **Hub de Projetos v2** é centralizar o ciclo de vida completo dos projetos corporativos em um único portal moderno, responsivo e intuitivo, permitindo:

- **Visibilidade Executiva 360°:** Acompanhamento de indicadores de desempenho, progresso, Capex, Opex e Ganhos Reais (ROI).
- **Rastreabilidade e Governança (Auditoria):** Registro automático de quem alterou qual informação, horário exato e valores alterados (DE / PARA).
- **Padronização Metodológica:** Estruturação de projetos seguindo as melhores práticas do PMI/PMP (Termo de Abertura, Matriz RACI, Gestão de Riscos e Red Flags).
- **Comunicação e Escalação Eficiente:** Mecanismo para escalar impedimentos (BOs) diretamente aos gestores com notificação via e-mail e registro histórico.
- **Relatórios Executivos Exportáveis:** Geração e exportação do documento **Business Blueprint (BBP)** em PDF com um único clique.
- **Base de Conhecimento Integrada (Wiki):** Compartilhamento de processos, metodologias e inclusão dinâmica de artigos (links externos e PDFs).

---

## 🛠️ Principais Funcionalidades Implementadas

### 1. 📊 Dashboard Executivo Interativo
- **Métricas ExecutivasGlobais:** Indicadores de Total de Projetos, Capex Anual, Opex Anual e Ganhos Reais apurados.
- **Cronograma Gantt Interativo:** Visualização gráfica do andamento dos projetos com barras de progresso e alertas visuais de prazo.
- **Segmentação por Área Requerente & Visão por Analista:** Gráficos e tabelas comparativas de distribuição do portfólio.
- **Roadmap Anual de Entregas:** Acompanhamento cronológico dos marcos operacionais ao longo dos meses.
- **Atividades Recentes Interativas:** Painel dinâmico com todas as atualizações recentes. **Cada atividade é clicável** e abre um modal detalhado (*ActivityModal*) exibindo data/hora no padrão brasileiro (`dd/MM/yyyy às HH:mm`), autor, projeto e atalho direto para a página do projeto ou tarefa.

---

### 2. 📁 Gestão de Projetos e Portfólio (PPM)
- **Wizard de Criação de Projetos em 4 Etapas:**
  1. *Informações Gerais & ROI Estimado*
  2. *Visão Geral, Objetivos & Escopo*
  3. *Custos (Capex/Opex) & Cronograma*
  4. *Stakeholders, RACI & Riscos*
- **Edição Mestre do Projeto:** Permite alterar parâmetros mestre (Sponsor, Responsável, Go-Live, Fase, etc.) com modal de confirmação e auditoria.
- **Permissões por Perfil de Acesso:** Perfis `ADMIN`, `MANAGER` e `ANALYST` possuem autonomia para editar qualquer campo nas abas dos projetos, garantindo agilidade operacional.

---

### 3. 📑 10 Abas de Gestão do Projeto (`ProjectDetails.jsx`)

1. 📄 **Visão Geral & Termo:** Resumo executivo, ganhos esperados, métricas/KPIs, drivers estratégicos, fora do escopo, requerimentos e *Red Lines*.
2. 📅 **Cronograma Gantt:** Gráfico de linha do tempo interativo do projeto.
3. ▫️ **Gerenciador de Tarefas:** Criação, edição, conclusão, remoção em massa e filtros avançados de atividades.
4. ⚠️ **Riscos & Red Flags:** Registro de riscos por impacto/mitigação e alertas críticos (*Red Flags*) categorizados por severidade.
5. ❓ **Open Points (Pendências):** Cadastro e acompanhamento de pendências com responsáveis e prazos definidos.
6. 👥 **Matriz RACI & Stakeholders:** Mapeamento de papéis (*Responsible, Accountable, Consulted, Informed*).
7. 🔀 **Matriz de Alterações:** Auditoria imutável do projeto.
8. 📁 **Arquivos & Emails:** Anexo de documentos institucionais e registro de histórico de e-mails.
9. ⏳ **Fluxo de Aprovação:** Acompanhamento da submissão do termo de abertura e validação pela diretoria.
10. 📜 **Histórico de Modificações (Nova Aba):** Visualização dedicada de todo o histórico de auditoria em linha do tempo, exibindo autor, horário, campo alterado e valores (DE / PARA).

---

### 4. 📄 Exportação do Business Blueprint (BBP em PDF)
- Botão **"Exportar BBP em PDF"** presente no cabeçalho das páginas do projeto.
- Gera instantaneamente o relatório executivo formatado com cabeçalho institucional, termo de abertura, resumo financeiro, matriz RACI, riscos e lista de tarefas.

---

### 5. 🚨 Escalação Executiva de BOs ao Gestor
- Botão **"Escalar BO"** nos itens críticos (Open Points, Red Flags e Tarefas).
- Modal para envio de solicitações de apoio ao gestor, definindo severidade, causa-raiz, detalhamento do impedimento e geração de e-mail de escalação.
- Registro automático na Matriz de Alterações e na central de e-mails do projeto.

---

### 6. 📚 Wiki de Projetos & Base de Conhecimento
- **Inserção Dinâmica de Artigos:** Botão para cadastrar novos artigos na Wiki, aceitando **Links externos** ou **Upload de Arquivos PDF**.
- **Cards de Conteúdo:** Os itens cadastrados são convertidos em cards na grade da Wiki com ações diretas (**🔗 Acessar Link** e **📄 Visualizar PDF**).
- **Conteúdo Metodológico:** Guias de implantação por tipo de projeto, diferenciação de Capex vs Opex, processo de validação com Segurança da Informação (SI), fluxos de contratação e forecast MIS.

---

### 7. 🌐 Internacionalização & Padrão PT-BR
- **Multi-Idioma:** Suporte a Português (PT-BR), Inglês (EN) e Espanhol (ES).
- **Localização PT-BR:** Formatação nativa de todas as datas no padrão brasileiro (`dd/MM/yyyy` e `dd/MM/yyyy às HH:mm`), dias da semana e meses em português.

---

### 8. 🎨 Identidade Visual & UX Premium
- **Logotipo e Favicon Customizados:** Ícone oficial de óculos brancos sobre fundo azul arredondado (`logo.png` e `favicon.png`).
- **Design System Moderno:** Suporte nativo a Dark Mode e Light Mode, cartões em glassmorphism, gradientes e micro-animações.

---

## 🧱 Tecnologias Utilizadas

- **Core & UI:** React.js, Vite, Tailwind CSS, Lucide React (Ícones)
- **Gerenciamento de Estado:** Redux Toolkit
- **Roteamento:** React Router DOM (v6)
- **Manipulação de Datas:** date-fns (com locale `ptBR`)
- **Notificações:** React Hot Toast
- **Geração de PDF:** HTML-to-PDF / Print API nativa customizada

---

## ⚡ Como Executar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev

# 3. Gerar a versão de produção
npm run build
```

---
*Documento gerado automaticamente para especificação do Hub de Projetos v2.*
