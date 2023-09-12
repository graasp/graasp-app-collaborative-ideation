import { List } from 'immutable';

import { IdeaAppData, IdeasData } from '@/config/appDataTypes';

export const anonymizeIdeas = (ideas: List<IdeaAppData>): IdeasData =>
  List(
    ideas.map((ideaData) => {
      const { idea, round, parentId, encoding } = ideaData.data;
      return {
        id: ideaData.id,
        idea,
        round,
        parentId,
        encoding,
      };
    }),
  );

// TODO: Rethink mechanism to select ideas.
export const showNewIdeas = (
  ideas: IdeasData,
  numberOfIdeasToShow: number,
  listOfSeenIdeas?: List<string>,
  minimumBotIdea?: number,
): IdeasData => {
  let ideasToChooseFrom = ideas;
  if (listOfSeenIdeas) {
    ideasToChooseFrom = ideas.filter(({ id }) => !listOfSeenIdeas.includes(id));
  }

  const participantIdeas = ideasToChooseFrom.filter((i) => !i?.bot);
  let botIdeas = ideasToChooseFrom.filter((i) => Boolean(i?.bot));
  if (botIdeas.isEmpty() && minimumBotIdea && minimumBotIdea > 0) {
    botIdeas = ideas.filter((i) => Boolean(i?.bot));
  }
  let botIdeasToShow: IdeasData = botIdeas;
  if (minimumBotIdea) {
    botIdeasToShow = botIdeas.slice(0, minimumBotIdea - 1);
  }
  const numberOfBotIdeasFound = botIdeasToShow.size;
  const ideasToShow = participantIdeas
    .slice(0, numberOfIdeasToShow - numberOfBotIdeasFound - 1)
    .merge(botIdeasToShow);

  return ideasToShow;
};
