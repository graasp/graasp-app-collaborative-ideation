export type Prompt = {
  title: string;
  details?: string;
  category?: string;
};

export type PromptsData = {
  currentPrompt: Prompt;
  pastPrompts: Array<Prompt>;
};
