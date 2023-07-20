import { FC } from 'react';

import { Card, CardContent, Typography } from '@mui/material';

import { IdeaAppData } from '@/config/appDataTypes';

const Idea: FC<{
  idea: IdeaAppData;
  onClick?: (id: string) => void;
}> = ({ idea, onClick }) => (
  <Card
    onClick={() => {
      if (typeof onClick !== 'undefined') return onClick(idea.id);
      return null;
    }}
  >
    <CardContent>
      <Typography variant="body1">{idea.data.idea}</Typography>
    </CardContent>
  </Card>
);

export default Idea;
