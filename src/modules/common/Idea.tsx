import { FC } from 'react';

import { Card, CardContent, Typography } from '@mui/material';

import { IdeaData } from '@/config/appDataTypes';

const Idea: FC<{
  idea: IdeaData & { id: string };
  onClick: (id: string) => void;
}> = ({ idea, onClick }) => (
  <Card onClick={() => onClick(idea.id)}>
    <CardContent>
      <Typography variant="body1">{idea.idea}</Typography>
    </CardContent>
  </Card>
);

export default Idea;
