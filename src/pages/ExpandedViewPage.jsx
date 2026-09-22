import React from 'react';
import { useSelector } from 'react-redux';
import ExpandedTreeView from '../components/projects/ExpandedTreeView';

const ExpandedViewPage = () => {
  const { translations: t } = useSelector(state => state.language);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            {t.expandedView}
          </h1>
          <p className="text-xs text-gray-500">Visão hierárquica por portfólio, subprojetos, indicadores de prazo e esforço</p>
        </div>
      </div>

      <ExpandedTreeView />
    </div>
  );
};

export default ExpandedViewPage;
