import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

import { useLocalContext } from '@graasp/apps-query-client';

import { saveAs } from 'file-saver';

import { useLoroContext } from '@/state/LoroContext';

import SettingsSection from '../common/SettingsSection';

const Export: FC = () => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.EXPORT',
  });
  const { doc } = useLoroContext();
  const { itemId } = useLocalContext();

  const downloadFile = (blob: Blob, ext: 'json' | 'loro'): void => {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.-]/g, '');
    const filename = `loro_export_${itemId}_${timestamp}.${ext}`;
    saveAs(blob, filename);
  };

  // const exportAsBinary = (): void => {
  //     const exportedDoc = doc.export({mode: 'snapshot'});
  //     const exportedDocStr = exportedDoc.toString();
  //     const blob = new Blob([exportedDocStr], {});
  //     downloadFile(blob, 'loro');
  // };

  const exportAsJSON = (): void => {
    const exportedDoc = doc.exportJsonUpdates();
    const blob = new Blob([JSON.stringify(exportedDoc)], {});
    downloadFile(blob, 'json');
  };

  return (
    <SettingsSection title={t('TITLE')}>
      {/* <Button
            onClick={exportAsBinary}
        >
            {t('EXPORT_BINARY')}
        </Button> */}
      <Button onClick={exportAsJSON}>{t('EXPORT_JSON')}</Button>
    </SettingsSection>
  );
};

export default Export;
