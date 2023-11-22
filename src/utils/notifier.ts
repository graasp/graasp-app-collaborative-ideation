import { Notifier } from '@graasp/apps-query-client';

// const {
//     deleteAppDataRoutine,
//     deleteAppSettingRoutine,
//     getAppDataRoutine,
//     getAppSettingsRoutine,
//     getLocalContextRoutine,
//     patchAppDataRoutine,
//     patchAppSettingRoutine,
//     postAppActionRoutine,
//     postAppDataRoutine,
//     postAppSettingRoutine,
//   } = ROUTINES;

// const EXCLUDED_NOTIFICATION_TYPES: string[] = [
//     getAppDataRoutine.SUCCESS,
//     postAppDataRoutine.SUCCESS,
//     patchAppDataRoutine.SUCCESS,
//     deleteAppDataRoutine.SUCCESS,
//     getAppSettingsRoutine.SUCCESS,
//     postAppSettingRoutine.SUCCESS,
//     patchAppSettingRoutine.SUCCESS,
//     deleteAppSettingRoutine.SUCCESS,
//     postAppActionRoutine.SUCCESS,
//     getLocalContextRoutine.SUCCESS,
//   ];

// const notifier: Notifier = (data) => {
//     const { payload } = data;
//     if (payload) {
//       // axios error
//       if (
//         payload.error &&
//         payload.error.name === 'AxiosError' &&
//         (payload.error as AxiosError).response
//       ) {
//         const { message } = (payload.error as AxiosError).response?.data as {
//           message: string;
//         };
//         toast.error(
//           <NetworkErrorToast
//             title={payload.error.message}
//             description={message}
//           />,
//         );
//       }
//       // only info messages for types that we do not know or when we have the debug env variable
//       if (
//         !EXCLUDED_NOTIFICATION_TYPES.includes(data.type) ||
//         import.meta.env.VITE_DEBUG
//       )
//         toast.success(<InfoToast type={data.type} payload={payload} />);
//     }
//   };

const notifier: Notifier = (data) => {
  const { type, payload } = data;
  switch (type) {
    case 'error': {
      // eslint-disable-next-line no-console
      console.error(payload);
      break;
    }
    default: {
      // eslint-disable-next-line no-console
      console.log(payload);
    }
  }
};

export default notifier;
