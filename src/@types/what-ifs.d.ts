import type { Prompt, PromptAuthor, PromptCategory } from '@/interfaces/prompt';

declare module 'what-ifs.json' {
  // eslint-disable-next-line no-labels, no-restricted-syntax
  Array<{
    name: string;
    description: string;
    author: Array<PromptAuthor>;
    link: string;
    categories: Array<PromptCategory>;
    set: Array<Prompt>;
  }>;
  Array<string>;
}
