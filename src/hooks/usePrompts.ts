// import { ChatBotMessage } from '@graasp/sdk';
// import { Liquid } from 'liquidjs';
// import { useMemo } from 'react';

// import { reformulationPrompt: reformulationPromptTemplate } from '@/config/prompts.json';

// interface UsePromptsValues {
//   reformulationPrompt: (response: string) => ChatBotMessage;
// }

// const usePrompts = (): UsePromptsValues => {
//   const le = useMemo(() => new Liquid(), []);
//   const reformulationPrompt = (response: string) => {
//     reformulationPromptTemplate.map((m:) => le.parseAndRenderSync(m))
//     return le.parseAndRenderSync()
//   };
//   return {
//     reformulationPrompt,
//   };
// };

// export default usePrompts;
