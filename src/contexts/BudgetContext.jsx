import React, { createContext, useState, useEffect } from 'react';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState(() => {
    const localData = localStorage.getItem('budgets');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addBudget = (budget) => {
    setBudgets((prevBudgets) => [
      ...prevBudgets,
      { ...budget, id: Date.now().toString(), createdAt: new Date().toISOString() },
    ]);
  };

  const deleteBudget = (budgetId) => {
    setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== budgetId));
  };

  // NOVA FUNÇÃO: updateBudget
  const updateBudget = (budgetId, updatedBudgetData) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === budgetId
          ? { ...budget, ...updatedBudgetData, updatedAt: new Date().toISOString() } // Adiciona/atualiza updatedAt
          : budget
      )
    );
  };

  return (
    <BudgetContext.Provider value={{ budgets, addBudget, deleteBudget, updateBudget }}> {/* Adiciona updateBudget ao provider */}
      {children}
    </BudgetContext.Provider>
  );
};