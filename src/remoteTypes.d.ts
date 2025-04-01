declare module "tasks/TaskManagement" {
    const TaskManagement: React.ComponentType<{
      userRole?: 'admin' | 'user';
      userId?: string;
    }>;
    
    export default TaskManagement;
  }