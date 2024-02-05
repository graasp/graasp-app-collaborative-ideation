/**
 * @file Chatbot avatar React component for Graasp
 * @copyright Basile Spaenlehauer and Juan Carlos Farah
 */
import { FC } from 'react';

import { SmartToy as BotIcon } from '@mui/icons-material';
import { Avatar } from '@mui/material';

const ChatbotAvatar: FC = () => (
  <Avatar
    sx={{
      backgroundColor: 'var(--graasp-primary)',
    }}
  >
    <BotIcon htmlColor="#fff" />
  </Avatar>
);

export default ChatbotAvatar;
