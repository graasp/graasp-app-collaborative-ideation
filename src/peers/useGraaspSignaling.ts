import { useEffect, useMemo } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import { AppDataTypes } from '@/config/appDataTypes';
import { hooks, mutations } from '@/config/queryClient';

import { PeerInfos } from './peerInfo';

interface UseGraaspSignalingValue {
  myPeerInfos?: PeerInfos;
  peersInfos: PeerInfos[];
}

const useGraaspSignaling = (myPeerId?: string): UseGraaspSignalingValue => {
  const { data: appData } = hooks.useAppData();

  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  const { accountId } = useLocalContext();

  const myPeerAppData = useMemo(
    () =>
      appData?.find(
        ({ type, creator }) =>
          type === AppDataTypes.PeerData && creator?.id === accountId,
      ),
    [accountId, appData],
  );

  const myPeerInfos = useMemo(() => {
    if (myPeerId) {
      return {
        id: myPeerId,
        accountId,
      };
    }

    return undefined;
  }, [accountId, myPeerId]);
  const peersInfos = useMemo<PeerInfos[]>(
    () =>
      appData
        ?.filter(
          ({ type, creator }) =>
            type === AppDataTypes.PeerData && creator?.id !== accountId,
        )
        .map(({ data }) => {
          if (typeof data?.id === 'string') {
            return {
              id: data.id,
            };
          }
          return { id: '' };
        }) ?? [],
    [accountId, appData],
  );

  useEffect(() => {
    if (myPeerAppData) {
      if (myPeerAppData.data.id !== myPeerId) {
        console.debug(
          'Patching peer data old id:',
          myPeerAppData.data.id,
          ' with new id:',
          myPeerId,
        );
        patchAppData({ id: myPeerAppData.id, data: { id: myPeerId } });
      }
    } else {
      postAppData({
        type: AppDataTypes.PeerData,
        data: { id: myPeerId },
        visibility: AppDataVisibility.Item,
      });
    }
    return () => {
      if (myPeerAppData) {
        deleteAppData({ id: myPeerAppData.id });
      }
    };
  }, [deleteAppData, myPeerAppData, myPeerId, patchAppData, postAppData]);

  return {
    myPeerInfos,
    peersInfos,
  };
};

export default useGraaspSignaling;
