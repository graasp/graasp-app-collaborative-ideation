import { ChatbotRole } from '@graasp/sdk';

import systemsThinkerIcon from '@/../public/assets/personas-icons/systems-thinker.svg';
import { AssistantPersonaPreset } from '@/interfaces/assistant';

const SystemsThinker: AssistantPersonaPreset = {
  iconUrl: systemsThinkerIcon,
  description: 'A systems thinker assistant',
  name: 'Systems thinker',
  message: [
    {
      role: ChatbotRole.System,
      content: '',
    },
  ],
};

export const PersonasPresets = [SystemsThinker];
