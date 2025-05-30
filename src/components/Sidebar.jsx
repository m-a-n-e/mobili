import React from 'react';

function Sidebar({ navItems, activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-2xl font-semibold text-sky-600">OrçaFácil</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors
              ${
                activeTab === item.id
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <p className="text-xs text-slate-500 text-center">&copy; {new Date().getFullYear()} Seu App</p>
      </div>
    </aside>
  );
}

export default Sidebar;