declare module 'what-ifs.json' {
  Array<{
    name: string;
    description: string;
    author: string;
    link: string;
    categories: Array<string>;
    set: Array<{
      title: string;
      details: string;
      category: string;
    }>;
  }>;
}
