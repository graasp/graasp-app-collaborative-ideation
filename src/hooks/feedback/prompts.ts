import system1 from './bank/system1.txt?raw';
import user1 from './bank/user1.txt?raw';

export type FeedbackPrompts = {
  metaSystemPrompt: string;
  comments: string;
  metaUserPrompt: string;
  exampleBank: { label: string; system: string; user: string }[];
};

export const feedbackPrompts: { [key: string]: FeedbackPrompts } = {
  en: {
    metaSystemPrompt: '{{ systemPrompt }}\n',
    comments: '{% for comment in comments %}\n. {{comment}}\n{% endfor %}\n',
    metaUserPrompt: '{{ userPrompt }}\n',
    exampleBank: [{ label: 'Default example', system: system1, user: user1 }],
  },
  fr: {
    metaSystemPrompt: '{{ systemPrompt }}\n',
    comments: '{% for comment in comments %}\n. {{comment}}\n{% endfor %}\n',
    metaUserPrompt: '{{ userPrompt }}\n',
    exampleBank: [
      { label: 'Exemple par défaut', system: system1, user: user1 },
    ],
  },
};
