declare module "*.svg" {
  const content: string;
  export default content;
}

export interface Resource {
  id?: string;
  name: string;
  description: string;
  category: string;
  image: File | null;
  availableDays: string[];
  startTime: string;
  endTime: string;
  resourceCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
  isActive?: boolean;
}

export interface UserSettings {
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}
