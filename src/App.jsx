import React, { useState } from 'react';
import { BudgetProvider } from './contexts/BudgetContext';
import Sidebar from './components/Sidebar';
import DocumentosPage from './pages/DocumentosPage';
import AnalisePage from './pages/AnalisePage';
import { FileText, BarChart2 } from 'lucide-react'; // Ícones de exemplo

function App() {
  const [activeTab, setActiveTab] = useState('documentos');

  const navItems = [
    { id: 'documentos', label: 'Documentos', icon: <FileText size={20} />, page: <DocumentosPage /> },
    { id: 'analise', label: 'Análise', icon: <BarChart2 size={20} />, page: <AnalisePage /> },
  ];

  const activePage = navItems.find(item => item.id === activeTab)?.page;

  return (
    <BudgetProvider>
      <div className="flex h-screen bg-slate-100">
        <Sidebar navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-y-auto">
          {activePage}
        </main>
      </div>
    </BudgetProvider>
  );
}

export default App;