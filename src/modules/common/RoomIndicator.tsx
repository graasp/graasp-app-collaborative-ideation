import React, { FC, useEffect, useMemo, useState } from 'react';

import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { Participant } from '@/interfaces/participant';
import { ConnectionStatus } from '@/interfaces/status';
import { useLoroContext } from '@/state/LoroContext';
import { ONLINE_USERS_KEY } from '@/state/TmpState';
import useParticipants from '@/state/useParticipants';
import stringToColor from '@/utils/stringToColor';

const RoomIndicator: FC = () => {
  const theme = useTheme();
  const {
    tmpState,
    connectionStatus,
    reconnect: reconnectLoro,
  } = useLoroContext(); // assume reconnect is available
  const { members } = useParticipants();
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  const onlineUsers = useMemo(
    () =>
      [...new Set(onlineUserIds)]
        .map((id) => members.find((u) => u.id === id))
        .filter((u): u is Participant => Boolean(u)),
    [onlineUserIds, members],
  );

  // eslint-disable-next-line no-console
  console.debug('Online users: ', [onlineUsers, onlineUserIds]);

  useEffect(() => {
    const unsubscribe = tmpState.subscribe(() => {
      setOnlineUserIds((tmpState.get(ONLINE_USERS_KEY) as string[]) || []);
    });

    return unsubscribe;
  }, [tmpState]);

  const reconnect = (): void => {
    // Logic to reconnect to the WebSocket or refresh the connection
    reconnectLoro();
  };

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
        <Typography variant="body1" color="textSecondary" mr={2}>
          {connectionStatus}
        </Typography>
        <Button variant="outlined" color="primary" onClick={reconnect}>
          Reconnect
        </Button>
      </Box>
    );
  }

  return (
    <AvatarGroup max={5}>
      {onlineUsers.map((user) => {
        const bgColor = stringToColor(user.id);

        return (
          <Tooltip key={user.id} title={user.name}>
            <Avatar sx={{ bgcolor: bgColor, color: 'white' }}>
              {user.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .replace(/[^a-zA-Z0-9]/g, '')
                .toUpperCase()}
            </Avatar>
          </Tooltip>
        );
      })}
    </AvatarGroup>
  );
};

export default RoomIndicator;
