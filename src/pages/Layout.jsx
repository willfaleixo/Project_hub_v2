import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateProjectWizard from '../components/projects/CreateProjectWizard';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadTheme } from '../features/themeSlice';
import { Loader2Icon } from 'lucide-react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { loading } = useSelector((state) => state.workspace);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
      <Loader2Icon className="size-7 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-slate-100 overflow-hidden">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        onOpenWizard={() => setIsWizardOpen(true)}
      />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Navbar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          onOpenWizard={() => setIsWizardOpen(true)}
        />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ onOpenWizard: () => setIsWizardOpen(true) }} />
        </div>
      </div>

      <CreateProjectWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </div>
  );
};

export default Layout;
