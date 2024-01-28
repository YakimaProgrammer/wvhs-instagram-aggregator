export interface Post {
  srcs: string[];
  caption: string;
  time: number;
  page: Page;
}

export interface Page {
  name: string;
  profile: string;
}