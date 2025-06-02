import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';

import { ResponseAppData } from '@/config/appDataTypes';
import exportResponses from '@/hooks/utils/export_responses';
import { ResponseEvaluation } from '@/interfaces/response';

const ExportResponsesButton: FC<{
  responses: Array<ResponseAppData<ResponseEvaluation>>;
}> = ({ responses }) => {
  const { t } = useTranslation('translations');
  const [isExporting, setIsExporting] = useState(false);
  const handleClick = (): void => {
    setIsExporting(true);
    exportResponses(responses).then(() => setIsExporting(false));
  };

  return (
    <Button
      loading={isExporting}
      onClick={handleClick}
      startIcon={<FileDownloadIcon />}
    >
      {isExporting ? `${t('EXPORTING')}...` : t('EXPORT_RESPONSES')}
    </Button>
  );
};

export default ExportResponsesButton;
