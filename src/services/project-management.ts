// Mock project management data service

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: string;
  dueDate?: string; // ISO string
  createdDate: string; // ISO string
  updatedDate: string; // ISO string
  project: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "on-hold";
  startDate: string;
  endDate?: string;
  members: string[];
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    members: ["Alice Chen", "Bob Smith", "Carol Johnson"],
  },
  {
    id: "proj-2",
    name: "Mobile App Launch",
    description: "Launch iOS and Android apps",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    members: ["David Kim", "Eva Martinez"],
  },
];

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design homepage mockup",
    description: "Create high-fidelity mockup for the new homepage",
    status: "in-progress",
    priority: "high",
    assignee: "Alice Chen",
    dueDate: "2024-03-15",
    createdDate: "2024-03-01",
    updatedDate: "2024-03-10",
    project: "Website Redesign",
    tags: ["design", "ui/ux"],
    estimatedHours: 16,
    actualHours: 12,
  },
  {
    id: "task-2",
    title: "Implement user authentication",
    description: "Add login/signup functionality to the app",
    status: "todo",
    priority: "critical",
    assignee: "Bob Smith",
    dueDate: "2024-03-20",
    createdDate: "2024-03-05",
    updatedDate: "2024-03-05",
    project: "Mobile App Launch",
    tags: ["backend", "security"],
    estimatedHours: 24,
  },
  {
    id: "task-3",
    title: "Write API documentation",
    status: "review",
    priority: "medium",
    assignee: "Carol Johnson",
    dueDate: "2024-03-18",
    createdDate: "2024-03-02",
    updatedDate: "2024-03-12",
    project: "Website Redesign",
    tags: ["documentation"],
    estimatedHours: 8,
    actualHours: 6,
  },
  {
    id: "task-4",
    title: "Database optimization",
    description: "Optimize database queries for better performance",
    status: "done",
    priority: "medium",
    assignee: "David Kim",
    dueDate: "2024-03-10",
    createdDate: "2024-03-01",
    updatedDate: "2024-03-09",
    project: "Mobile App Launch",
    tags: ["backend", "performance"],
    estimatedHours: 12,
    actualHours: 10,
  },
  {
    id: "task-5",
    title: "User testing session",
    status: "todo",
    priority: "low",
    assignee: "Eva Martinez",
    dueDate: "2024-03-25",
    createdDate: "2024-03-08",
    updatedDate: "2024-03-08",
    project: "Website Redesign",
    tags: ["testing", "research"],
    estimatedHours: 6,
  },
];

// Tool functions
export async function getTasks(filters?: {
  status?: Task["status"];
  priority?: Task["priority"];
  assignee?: string;
  project?: string;
  overdue?: boolean;
  sortBy?: "dueDate" | "priority" | "createdDate";
  sortOrder?: "asc" | "desc";
}): Promise<Task[]> {
  let filteredTasks = [...mockTasks];

  // Apply filters
  if (filters?.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }
  
  if (filters?.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
  }
  
  if (filters?.assignee) {
    filteredTasks = filteredTasks.filter(task => task.assignee === filters.assignee);
  }
  
  if (filters?.project) {
    filteredTasks = filteredTasks.filter(task => task.project === filters.project);
  }
  
  if (filters?.overdue) {
    const now = new Date();
    filteredTasks = filteredTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && task.status !== "done"
    );
  }

  // Apply sorting
  if (filters?.sortBy) {
    const priorityOrder = { "low": 1, "medium": 2, "high": 3, "critical": 4 };
    
    filteredTasks.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      const sortBy = filters.sortBy!;
      
      if (sortBy === "priority") {
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      } else if (sortBy === "dueDate" || sortBy === "createdDate") {
        aValue = a[sortBy] ? new Date(a[sortBy]) : new Date(0);
        bValue = b[sortBy] ? new Date(b[sortBy]) : new Date(0);
      } else {
        aValue = a[sortBy] || "";
        bValue = b[sortBy] || "";
      }
      
      const order = filters.sortOrder === "desc" ? -1 : 1;
      if (aValue > bValue) return order;
      if (aValue < bValue) return -order;
      return 0;
    });
  }

  return filteredTasks;
}

export async function updateTaskStatus(
  taskId: string, 
  updates: Partial<Pick<Task, "status" | "priority" | "assignee" | "dueDate">>
): Promise<Task> {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    throw new Error(`Task with ID ${taskId} not found`);
  }
  
  mockTasks[taskIndex] = {
    ...mockTasks[taskIndex],
    ...updates,
    updatedDate: new Date().toISOString(),
  };
  
  return mockTasks[taskIndex];
}

export async function createTask(taskData: Omit<Task, "id" | "createdDate" | "updatedDate">): Promise<Task> {
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}`,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  };
  
  mockTasks.push(newTask);
  return newTask;
}

export async function getProjects(): Promise<Project[]> {
  return mockProjects;
}