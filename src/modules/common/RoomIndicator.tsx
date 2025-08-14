import React, { FC } from 'react';

import {
  Avatar,
  AvatarGroup,
  Box,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import { Participant } from '@/interfaces/participant';
import { ConnectionStatus } from '@/interfaces/status';
import { useLoroContext } from '@/state/LoroContext';
import { ONLINE_USERS_KEY } from '@/state/TmpState';
import useParticipants from '@/state/useParticipants';
import stringToColor from '@/utils/stringToColor';

const RoomIndicator: FC = () => {
  const theme = useTheme();
  const { tmpState, connectionStatus } = useLoroContext(); // assumed shape
  const { members } = useParticipants();
  const onlineUserIds = (tmpState.get(ONLINE_USERS_KEY) as string[]) || [];

  if (connectionStatus !== ConnectionStatus.CONNECTED) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={2}
        bgcolor={theme.palette.grey[200]}
        borderRadius={2}
      >
        <Typography variant="body2" color="textSecondary">
          App is offline
        </Typography>
      </Box>
    );
  }

  const onlineUsers = [...new Set(onlineUserIds)]
    .map((id) => members.find((u) => u.id === id))
    .filter((u): u is Participant => Boolean(u));

  console.debug('Online users:', onlineUsers);

  return (
    <AvatarGroup max={5}>
      {onlineUsers.map((user) => {
        const bgColor = stringToColor(user.id);
        // const colorIndex = Math.abs(
        //   Array.from(user.name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
        // ) % theme.palette.augmentColor
        //   ? 10
        //   : 10; // Just a placeholder for color generation

        // const bgColor = theme.palette.primary[
        //   (["light", "main", "dark"] as const)[colorIndex % 3]
        // ];

        return (
          <Tooltip key={user.id} title={user.name}>
            <Avatar sx={{ bgcolor: bgColor }}>
              {user.name[0].toUpperCase()}
            </Avatar>
          </Tooltip>
        );
      })}
    </AvatarGroup>
  );
};

export default RoomIndicator;
