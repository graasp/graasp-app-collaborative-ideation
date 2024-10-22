import { useMemo } from 'react';

import { QUERY_KEYS, queryClient } from '@/config/queryClient';

const useInvalidateAppData = (): (() => void) => {
  const invalidateAppData = useMemo(
    () => () => queryClient.invalidateQueries(QUERY_KEYS.appDataKeys.all),
    [],
  );
  return invalidateAppData;
};

export default useInvalidateAppData;
