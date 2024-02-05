import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { AssistantPersona } from '@/interfaces/assistant';
import ChatbotAvatar from '@/modules/common/ChatbotAvatar';

interface AssistantCardProps {
  assistant: AssistantPersona;
  onEdit: (assistantToEdit: AssistantPersona) => void;
  onDelete: (assistantToDelete: AssistantPersona) => void;
}

const AssistantCard: FC<AssistantCardProps> = ({
  assistant,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { name, description } = assistant;
  return (
    <Card>
      <CardHeader avatar={<ChatbotAvatar />} title={name} />
      <CardContent>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onEdit(assistant)}>{t('EDIT')}</Button>
        <Button color="error" onClick={() => onDelete(assistant)}>
          {t('DELETE')}
        </Button>
      </CardActions>
    </Card>
  );
};
export default AssistantCard;
