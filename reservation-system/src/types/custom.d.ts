declare module "*.svg" {
  const content: string;
  export default content;
}

export interface Resource {
  _id?: string;
  name: string;
  description: string;
  category: Category | string;
  imageUrl: File | null | string;
  availableDays: Array<string>;
  availableTime: Array<string>;
  resourceCount: number;
  location: string;
  status: string;
}

export interface Category {
  _id: string;
  name: string;
  createdBy: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
  isActive?: boolean;
  status: string;
  message: string;
  phoneNumber: string;
  profileImageUrl?: File | null | string;
}
export interface Reservation {
  _id: string;
  reservationDate: string;
  time: Array<string>;
  status: "pending" | "approved" | "cancelled" | "confirmed";
  reason?: string;
  name: string;
  userEmail: string;
  userName: string;
}
export interface UserSettings {
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}
