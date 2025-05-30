import React, { useState, useContext, useEffect } from 'react';
import { BudgetContext } from '../contexts/BudgetContext';
import { generateBudgetPDF } from '../utils/pdfGenerator';
import { X, Plus, Trash, FileDown, Save, User } from 'lucide-react'; // Adicionado User

function NovoDocumentoModal({ onClose, budgetToEdit }) {
  const { addBudget, updateBudget } = useContext(BudgetContext);
  const isEditMode = Boolean(budgetToEdit);

  const [clientName, setClientName] = useState(''); // NOVO ESTADO: Nome do Cliente
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (isEditMode && budgetToEdit) {
      setClientName(budgetToEdit.clientName || ''); // Preenche nome do cliente
      setItems(budgetToEdit.items.map(item => ({ ...item, id: item.id || Date.now() + Math.random() })));
      setObservations(budgetToEdit.observations || '');
    } else {
      setClientName(''); // Limpa nome do cliente
      setItems([]);
      setObservations('');
    }
    setItemName('');
    setItemPrice('');
    setItemQuantity(1);
  }, [isEditMode, budgetToEdit]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemName && itemPrice > 0 && itemQuantity > 0) {
      setItems([...items, { name: itemName, price: parseFloat(itemPrice), quantity: parseInt(itemQuantity), id: Date.now() }]);
      setItemName('');
      setItemPrice('');
      setItemQuantity(1);
    } else {
      alert('Por favor, preencha o nome do item, preço e quantidade (maior que zero).');
    }
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitBudget = () => {
    if (!clientName.trim()) { // Validação do nome do cliente
      alert('Por favor, insira o nome do cliente.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um item ao orçamento.');
      return;
    }
    
    const budgetId = isEditMode ? budgetToEdit.id : Date.now().toString();
    const creationDate = isEditMode ? budgetToEdit.createdAt : new Date().toISOString();

    const currentBudgetData = {
      id: budgetId, // Adiciona ID aqui para consistência no PDF e no objeto salvo
      createdAt: creationDate, // Adiciona createdAt aqui
      clientName, // Adiciona nome do cliente
      items,
      observations,
      total: calculateTotal(),
      ...(isEditMode && { updatedAt: new Date().toISOString() }) // Adiciona updatedAt se estiver editando
    };

    if (isEditMode) {
      updateBudget(budgetToEdit.id, currentBudgetData); // updateBudget já espera o ID como primeiro argumento
                                                        // e os dados a serem atualizados
    } else {
      addBudget(currentBudgetData); // addBudget não precisa mais gerar id e createdAt se já passamos
    }
    
    // Gera o PDF com os dados completos, incluindo ID e data de criação
    generateBudgetPDF(currentBudgetData); 
    
    onClose();
  };
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-semibold text-slate-700">
            {isEditMode ? `Editar Orçamento #${budgetToEdit.id.slice(-6)}` : 'Criar Novo Orçamento'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Nome do Cliente */}
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 mb-1">
              <User size={14} className="inline mr-1 mb-0.5" /> Nome do Cliente
            </label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
              placeholder="Digite o nome do cliente"
            />
          </div>

          {/* Formulário de Adicionar Item */}
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border border-gray-300 shadow-sm rounded-md bg-white">
            {/* ... campos do item (Nome, Qntd, Preço) e botão Adicionar Item permanecem os mesmos ... */}
            <div className="md:col-span-2">
              <label htmlFor="itemName" className="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
              <input
                type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                placeholder="Ex: Desenvolvimento de Website"
              />
            </div>
            <div>
              <label htmlFor="itemQuantity" className="block text-sm font-medium text-slate-700 mb-1">Qntd.</label>
              <input
                type="number" id="itemQuantity" value={itemQuantity} min="1" onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="itemPrice" className="block text-sm font-medium text-slate-700 mb-1">Preço Unit. (R$)</label>
              <input
                type="number" id="itemPrice" value={itemPrice} min="0.01" step="0.01" onChange={(e) => setItemPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                placeholder="1500.00"
              />
            </div>
            <button type="submit" className="md:col-span-4 mt-2 md:mt-0 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-sm flex items-center justify-center transition-colors text-sm">
              <Plus size={18} className="mr-2" /> Adicionar Item
            </button>
          </form>

          {/* Lista de Itens Adicionados ... */}
          {items.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-slate-700">Itens do Orçamento:</h4>
              <ul className="max-h-60 overflow-y-auto border rounded-md divide-y divide-slate-200">
                {items.map((item) => (
                  <li key={item.id} className="p-3 flex justify-between items-center hover:bg-slate-50 text-sm">
                    <div className="flex-1">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <p className="text-xs text-slate-500">
                        {item.quantity} x R$ {item.price.toFixed(2)} = R$ {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-right font-bold text-lg text-slate-700">
                Subtotal: R$ {calculateTotal().toFixed(2)}
              </p>
            </div>
          )}

          {/* Observações ... */}
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea
              id="observations" value={observations} onChange={(e) => setObservations(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
              placeholder="Detalhes adicionais, termos, validade da proposta, etc."
            ></textarea>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-5 border-t bg-slate-50 flex justify-end items-center space-x-3">
            <div className="text-xl font-bold text-slate-800">
                Total Final: R$ {calculateTotal().toFixed(2)}
            </div>
            <button
                onClick={handleSubmitBudget}
                disabled={items.length === 0 && !isEditMode}
                className={`font-medium py-2.5 px-6 rounded-md shadow-sm flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${isEditMode 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
            >
              {isEditMode ? <Save size={18} className="mr-2" /> : <FileDown size={18} className="mr-2" />}
              {isEditMode ? 'Salvar Alterações' : 'Gerar PDF e Salvar'}
            </button>
        </div>
      </div>
    </div>
  );
}

export default NovoDocumentoModal;