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
}
