import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Zora Creator</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}