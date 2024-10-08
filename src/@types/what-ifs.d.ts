import type { Prompt, PromptAuthor, PromptCategory } from '@/interfaces/prompt';

declare module 'what-ifs.json' {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  Array<{
    name: string;
    description: string;
    author: Array<PromptAuthor>;
    link: string;
    categories: Array<PromptCategory>;
    set: Array<Prompt>;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  Array<string>;
}
