/* eslint-disable no-restricted-globals */
import { createContext, useContext, useMemo, useState } from 'react';

import { LoroDoc } from 'loro-crdt';

// declare const self: DedicatedWorkerGlobalScope;

// const DATA_SNAPSHOT_LOCAL_STORAGE_KEY = 'loro-data-snapshot';

export type LoroContextType = {
  doc: LoroDoc;
};

const defaultContextValue = {
  doc: new LoroDoc(),
};

const LoroContext = createContext<LoroContextType>(defaultContextValue);

type LoroContextProps = {
  children: JSX.Element;
};

export const LoroProvider = ({ children }: LoroContextProps): JSX.Element => {
  const [doc] = useState(new LoroDoc());

  console.log('Worker started');

  // responses.subscribe((event: LoroEventBatch) => {
  //   console.debug('Responses updated ', event);
  //   self.postMessage({
  //     type: AppStateEventType.ALL_RESPONSES,
  //     data: responses.toArray(),
  //   });
  // });

  // doc.subscribe(() => {
  //   self.console.log('Document updated');
  //   const { updateMessage, updateVersion, transferables } = getUpdate(
  //     doc,
  //     lastUpdateVersion,
  //   );
  //   lastUpdateVersion = updateVersion;
  //   self.postMessage(updateMessage, transferables);
  // });

  const contextValue = useMemo(
    () => ({
      doc,
    }),
    [doc],
  );
  return (
    <LoroContext.Provider value={contextValue}>{children}</LoroContext.Provider>
  );
};

export const useLoroContext = (): LoroContextType => useContext(LoroContext);

// self.addEventListener('online', () => {
//   console.log('Online');
// });

// self.addEventListener('message', (event: MessageEvent) => {
//   const { type, data } = event.data;

//   console.debug('Received message', type, data);

//   if (type === AppStateEventType.UPDATE_CONFIG) {
//     self.console.log('Updating config', data);
//     config = data;
//   } else if (typeof config !== 'undefined') {
//     switch (type) {
//       case AppStateEventType.POST_RESPONSE:
//         self.postMessage(postResponse(data, config.author, responses));
//         doc.commit();
//         break;
//       case AppStateEventType.POST_UPDATE: {
//         self.console.log('Received update with data:', data);
//         const buffer = new Uint8Array(data);
//         doc.import(buffer);
//         break;
//       }
//       case 'delete':
//         break;
//       default:
//         // eslint-disable-next-line no-console
//         console.warn('Unknown message type:', type);
//     }
//   } else {
//     // eslint-disable-next-line no-console
//     console.warn('No config set');
//   }

//   // Send back the updated document
//   // self.postMessage({ type: 'update', data: doc.toJSON() });
// });

// self.postMessage({ type: AppStateEventType.GET_CONFIG });
