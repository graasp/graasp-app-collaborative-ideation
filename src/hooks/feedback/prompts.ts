export type FeedbackPrompts = {
  metaSystemPrompt: string;
  comments: string;
  metaUserPrompt: string;
};

export const feedbackPrompts: { [key: string]: FeedbackPrompts } = {
  en: {
    metaSystemPrompt: '{{ systemPrompt }}\n',
    comments: '{% for comment in comments %}\n. {{comment}}\n{% endfor %}\n',
    metaUserPrompt: '{{ userPrompt }}\n',
  },
};
