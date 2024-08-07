export type Prompt = {
  title: string;
  details?: string;
  category?: string;
};

export type FullPromptCategory = {
  name: string;
  description?: string;
  color?: string;
};

export type PromptCategory = string | FullPromptCategory;

export type PromptAuthor =
  | string
  | {
      name: string;
      email?: string;
      link?: string;
    };

export type PromptsData = {
  currentPrompt: Prompt;
  pastPrompts: Array<Prompt>;
};

export enum PromptUsage {
  USED,
  CURRENT,
  REMAINING,
}
