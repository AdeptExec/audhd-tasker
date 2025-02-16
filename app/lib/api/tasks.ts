import { Task } from '../types/tasks';
import { api } from './client';

type CreateTaskData = Omit<Task, 'id'>;
type UpdateTaskData = Partial<CreateTaskData>;

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks/all');
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/api/tasks/create', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },

  generateBreakdown: async (data: CreateTaskData) => {
    const response = await api.post('/api/tasks/generate', data);
    return response.data;
  },

  getGenerationUsage: async (): Promise<{
    daily_limit: number;
    generations_used: number;
    generations_remaining: number;
  }> => {
    const response = await api.get('/api/tasks/usage');
    return response.data;
  }
};