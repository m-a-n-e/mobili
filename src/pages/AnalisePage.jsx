import React from 'react';

function AnalisePage() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">Análise de Orçamentos</h2>
      <div className="bg-white p-10 rounded-lg shadow text-center">
        <p className="text-slate-600 text-lg">
          Esta área será dedicada à análise dos dados dos orçamentos criados.
        </p>
        <p className="text-slate-500 mt-2">
          Aqui você poderá visualizar gráficos de valores, quantidade de orçamentos por período, e outras métricas relevantes.
        </p>
        {/* Você pode adicionar bibliotecas de gráficos como Recharts ou Chart.js aqui no futuro */}
      </div>
    </div>
  );
}

export default AnalisePage;