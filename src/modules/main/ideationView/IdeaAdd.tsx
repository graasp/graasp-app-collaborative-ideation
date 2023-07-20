import { FC } from 'react';

import Stack from '@mui/material/Stack';

import { Button } from '@graasp/ui';

import { Derivation, IdeaAppData } from '@/config/appDataTypes';
import Idea from '@/modules/common/Idea';

const IdeaAdd: FC<{
  idea: IdeaAppData;
  onDerivationChoose: (d: Derivation) => void;
}> = ({ idea, onDerivationChoose }) => (
  <>
    <Stack direction="row">
      <Button onClick={() => onDerivationChoose('lateral')}>Lateral</Button>
      <Idea idea={idea} />
      <Button onClick={() => onDerivationChoose('variation')}>Variation</Button>
    </Stack>
    <Button onClick={() => onDerivationChoose('precision')}>Precision</Button>
  </>
);

export default IdeaAdd;
