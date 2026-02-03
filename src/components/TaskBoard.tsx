'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task } from '@/data/initial-data';
import { useData } from '@/context/DataContext';

const columns = [
  { id: 'todo', title: 'To Do', icon: '○', color: 'zinc' },
  { id: 'in-progress', title: 'In Progress', icon: '◐', color: 'amber' },
  { id: 'done', title: 'Done', icon: '●', color: 'emerald' },
] as const;

const priorityStyles = {
  high: { border: 'border-l-red-500', bg: 'bg-red-500/5', text: 'text-red-500', label: 'High' },
  medium: { border: 'border-l-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-500', label: 'Med' },
  low: { border: 'border-l-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-500', label: 'Low' },
};

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
}

function TaskModal({ task, onClose, onSave, onDelete }: TaskModalProps) {
  const { projects } = useData();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'todo');
  const [projectId, setProjectId] = useState(task?.projectId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, priority, status, projectId: projectId || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">
          {task ? 'Edit Task' : 'New Task'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Task title..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
              placeholder="Optional description..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Task['priority'])}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Task['status'])}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Project (optional)
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">No project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-3">
            {task && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(); onClose(); }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press"
            >
              {task ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const { projects } = useData();
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  const priority = priorityStyles[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(task)}
          className={`group p-4 rounded-xl border-l-4 border border-zinc-200 dark:border-zinc-700/50 cursor-pointer transition-all duration-200 ${
            priority.border
          } ${priority.bg} ${
            snapshot.isDragging 
              ? 'shadow-2xl shadow-black/20 scale-[1.02] rotate-1 border-indigo-500/50' 
              : 'hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}
        >
          <p className="text-sm font-medium text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-3 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold ${priority.text} bg-current/10 px-2 py-0.5 rounded-full`}>
              {priority.label}
            </span>
            {project && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate max-w-[100px]">
                  {project.name}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function TaskBoard() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as Task['status'];
    moveTask(taskId, newStatus);
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const openNew = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Task Board</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            Drag tasks between columns to update status
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
        >
          <span className="text-lg">+</span>
          New Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column, columnIndex) => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            return (
              <div 
                key={column.id} 
                className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 animate-slide-up"
                style={{ animationDelay: `${columnIndex * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                    column.id === 'done' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : column.id === 'in-progress'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {column.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="ml-auto text-xs font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 w-6 h-6 flex items-center justify-center rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[250px] rounded-xl p-2 -m-2 transition-all duration-200 ${
                        snapshot.isDraggingOver 
                          ? 'bg-indigo-500/5 ring-2 ring-indigo-500/20 ring-inset' 
                          : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onEdit={openEdit}
                        />
                      ))}
                      {provided.placeholder}
                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center py-12 text-xs text-zinc-400 dark:text-zinc-600">
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-xl">
                            📋
                          </div>
                          No tasks
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={editingTask ? () => deleteTask(editingTask.id) : undefined}
        />
      )}
    </div>
  );
}
