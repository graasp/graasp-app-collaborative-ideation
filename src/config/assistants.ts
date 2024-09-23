import { ChatbotRole } from '@graasp/sdk';

import systemsThinkerIcon from '@/../public/assets/personas-icons/systems-thinker.svg';
import {
  AssistantPersonaPreset,
  LLMAssistantConfiguration,
} from '@/interfaces/assistant';

const SystemsThinker: AssistantPersonaPreset<LLMAssistantConfiguration> = {
  iconUrl: systemsThinkerIcon,
  description: 'A systems thinker assistant',
  name: 'Systems thinker',
  configuration: [
    {
      role: ChatbotRole.System,
      content: '',
    },
  ],
};

export const PersonasPresets = [SystemsThinker];
