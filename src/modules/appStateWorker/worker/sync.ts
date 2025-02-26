import { LoroDoc, VersionVector } from 'loro-crdt';

import { AppStateEventType } from '../appStateWorkerConfig';

export const getUpdate = (
  doc: LoroDoc,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lastUpdateVersion: VersionVector,
): {
  updateMessage: { type: AppStateEventType; data: Uint8Array };
  updateVersion: VersionVector;
} => {
//   const updateData = doc.export({ mode: 'update', from: lastUpdateVersion });
  const updateData = doc.export({ mode: 'snapshot'});
  console.log("Snapshot: ", updateData);
  return {
    updateMessage: {
      type: AppStateEventType.SEND_UPDATE,
      data: updateData,
    },
    updateVersion: doc.version(),
  };
};
