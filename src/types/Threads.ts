export interface ThreadInterface {
  id: number;
  authorId: number;
  familyId: number;
  title: string;
  content: string;
  createdAt: Date;
  postCount: number;
}

export interface PostInterface {
  id: number;
  authorId: number;
  threadId: number;
  content: string;
  createdAt: Date;
}
