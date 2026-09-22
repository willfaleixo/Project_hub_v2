import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import MetricCards from '../components/dashboard/MetricCards';
import InteractiveGanttTimeline from '../components/dashboard/InteractiveGanttTimeline';
import AreaSegmentation from '../components/dashboard/AreaSegmentation';
import AnalystOverview from '../components/dashboard/AnalystOverview';
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart';
import AnnualCostsAndGainsChart from '../components/dashboard/AnnualCostsAndGainsChart';
import AnnualRoadmap from '../components/dashboard/AnnualRoadmap';
import RecentActivity from '../components/RecentActivity';
import GlobalDashboardFilter from '../components/dashboard/GlobalDashboardFilter';
import AttentionProjectsWidget from '../components/dashboard/AttentionProjectsWidget';
import PortfolioExportModal from '../components/projects/PortfolioExportModal';

const Dashboard = () => {
  const [isPortfolioExportOpen, setIsPortfolioExportOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Portfolio PDF Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Dashboard Executivo de Portfólio</h1>
          <p className="text-xs text-zinc-500">Visão consolidada de saúde, prazos e métricas dos projetos corporativos</p>
        </div>

        <button
          onClick={() => setIsPortfolioExportOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl text-xs transition shadow-sm"
          title="Exportar Relatório Executivo de Todo o Portfólio em PDF"
        >
          <Printer size={15} />
          <span>📄 Exportar Portfólio (PDF)</span>
        </button>
      </div>

      {/* Persistent Global Filter Bar */}
      <GlobalDashboardFilter />

      {/* 1. Metric Cards (Quantidade e Totais) */}
      <MetricCards />

      {/* 2. Executive Charts Grid */}
      <div className="space-y-6">
        {/* Row A: Status dos Projetos + Segmentação por Área */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectStatusChart />
          <AreaSegmentation />
        </div>

        {/* Row B: Custos Totais vs. Ganhos Reais + Visão por Analista */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <AnnualCostsAndGainsChart />
          </div>
          <div className="lg:col-span-5">
            <AnalystOverview />
          </div>
        </div>
      </div>

      {/* 3. Attention Projects Alert Widget */}
      <AttentionProjectsWidget />

      {/* 4. Interactive Gantt Timeline */}
      <InteractiveGanttTimeline />

      {/* 5. Roadmap do Ano & Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnnualRoadmap />
        <RecentActivity />
      </div>

      {/* Portfolio Export PDF Modal */}
      <PortfolioExportModal
        isOpen={isPortfolioExportOpen}
        onClose={() => setIsPortfolioExportOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
