import { Project } from "../types";
import { INITIAL_PROJECTS } from "../mockData";

let projectsStore = [...INITIAL_PROJECTS];

export const projectsApi = {
  async getProjects(): Promise<Project[]> {
    return Promise.resolve([...projectsStore]);
  },

  async getProjectById(id: string): Promise<Project | null> {
    const proj = projectsStore.find((p) => p.id === id);
    return Promise.resolve(proj || null);
  },

  async createProject(newProj: Omit<Project, "id">): Promise<Project> {
    const proj: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
    };
    projectsStore.push(proj);
    return Promise.resolve(proj);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const idx = projectsStore.findIndex((p) => p.id === id);
    if (idx === -1) return Promise.resolve(null);
    projectsStore[idx] = { ...projectsStore[idx], ...updates };
    return Promise.resolve(projectsStore[idx]);
  },
};
