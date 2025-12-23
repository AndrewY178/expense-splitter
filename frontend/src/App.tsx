import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="max-w-md w-full px-6 py-8 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">Expense Splitter</h1>
        <p className="text-slate-300 text-center">
          Backend on <span className="font-mono text-emerald-400">http://localhost:8080</span>, frontend on{' '}
          <span className="font-mono text-emerald-400">http://localhost:5173</span>.
        </p>
        <p className="text-slate-400 text-sm mt-4 text-center">
          Next steps: add auth pages, groups, expenses, and settlements.
        </p>
      </div>
    </div>
  );
};

export default App;


