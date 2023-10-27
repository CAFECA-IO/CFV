export interface IMission {
  totalPage: number;
  missions: {
    id: string;
    name: string;
    done: boolean;
    createdAt: string;
    updatedAt: string;
    progress: number;
    user: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}
