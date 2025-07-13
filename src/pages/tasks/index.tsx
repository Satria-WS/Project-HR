// src/pages/tasks/index.tsx
import React from 'react';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';

export function Tasks() {
  return (
    <div className="p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-500">
            Manage and track your project tasks
          </p>
        </header>

        <KanbanBoard />
      </div>
    </div>
  );
}
