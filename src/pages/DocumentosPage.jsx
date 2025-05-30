import React, { useState, useContext } from 'react';
import { BudgetContext } from '../contexts/BudgetContext';
import NovoDocumentoModal from '../components/NovoDocumentoModal';
import { PlusCircle, Trash2, Download, Edit3 } from 'lucide-react'; // Importado Edit3
import { generateBudgetPDF } from '../utils/pdfGenerator';

function DocumentosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { budgets, deleteBudget } = useContext(BudgetContext);
  const [budgetToEdit, setBudgetToEdit] = useState(null); // NOVO ESTADO: para guardar o orçamento a ser editado

  const handleOpenModalForCreate = () => {
    setBudgetToEdit(null); // Garante que está em modo de criação
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (budget) => {
    setBudgetToEdit(budget); // Define o orçamento para edição
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBudgetToEdit(null); // Limpa o orçamento em edição ao fechar
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-slate-700">Meus Orçamentos</h2>
        <button
          onClick={handleOpenModalForCreate} // Alterado para a nova função
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Criar Novo Orçamento
        </button>
      </div>

      {/* Passa budgetToEdit para o modal */}
      {isModalOpen && <NovoDocumentoModal onClose={handleCloseModal} budgetToEdit={budgetToEdit} />}

      {budgets.length === 0 ? (
        <p className="text-slate-500 text-center py-10">Nenhum orçamento criado ainda.</p>
      ) : (
        <div className="space-y-4">
          {budgets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((budget) => (
            <div key={budget.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-sky-700">Orçamento #{budget.id.slice(-6)}</h3>
                  <p className="text-sm text-slate-500">
                    Criado em: {new Date(budget.createdAt).toLocaleDateString('pt-BR')} às {new Date(budget.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}
                    {budget.updatedAt && ( // Mostra data de atualização se existir
                      <span className="ml-2 text-xs text-slate-400">(Editado: {new Date(budget.updatedAt).toLocaleDateString('pt-BR')})</span>
                    )}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Total: <span className="font-bold">R$ {budget.total.toFixed(2)}</span> ({budget.items.length} itens)
                  </p>
                </div>
                <div className="flex space-x-2 mt-1">
                  {/* NOVO BOTÃO DE EDITAR */}
                  <button
                    onClick={() => handleOpenModalForEdit(budget)}
                    title="Editar Orçamento"
                    className="p-2 text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => generateBudgetPDF(budget)}
                    title="Baixar PDF"
                    className="p-2 text-slate-500 hover:text-sky-600 transition-colors"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir o orçamento #${budget.id.slice(-6)}?`)) {
                        deleteBudget(budget.id);
                      }
                    }}
                    title="Excluir Orçamento"
                    className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              {budget.observations && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-medium mb-1">Observações:</p>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{budget.observations}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentosPage;