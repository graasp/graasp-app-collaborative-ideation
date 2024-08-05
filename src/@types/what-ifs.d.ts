declare module 'what-ifs.json' {
  // eslint-disable-next-line no-labels, no-restricted-syntax
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
  Array<string>;
}
