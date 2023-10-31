import { List } from 'immutable';

import { IdeaAppData, IdeasData, RatingsAppData } from '@/config/appDataTypes';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';

const average = (array: number[]): number => {
  if (array.length > 0) {
    return array.reduce((a, b) => a + b) / array.length;
  }
  return 0;
};

export const anonymizeIdeas = (
  ideas: List<IdeaAppData>,
  ratings?: List<RatingsAppData<NoveltyRelevanceRatings>>,
): IdeasData =>
  List(
    ideas.map((ideaData) => {
      const { idea, round, parentId, encoding } = ideaData.data;
      let r: NoveltyRelevanceRatings | undefined;
      if (ratings) {
        const listOfRatings = ratings
          .filter(({ data }) => data.ideaRef === ideaData.id)
          .map(({ data }) => data.ratings);
        const usefulnessList: number[] = [];
        const noveltyList: number[] = [];
        listOfRatings.forEach(({ usefulness, novelty }) => {
          if (usefulness) usefulnessList.push(usefulness);
          if (novelty) noveltyList.push(novelty);
        });
        const meanUsefulness = average(usefulnessList);
        const meanNovelty = average(noveltyList);
        r = { novelty: meanNovelty, usefulness: meanUsefulness };
      }
      return {
        id: ideaData.id,
        idea,
        round,
        parentId,
        encoding,
        ratings: r,
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
