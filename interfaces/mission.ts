export interface IMission {
  totalPage: number;
  missions: {
    id: string;
    name: string;
    done: boolean;
    created_at: string;
    updated_at: string;
    progress: number;
    user: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}
