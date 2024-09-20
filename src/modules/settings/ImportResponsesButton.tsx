import useResponses from '@/hooks/useResponses';
import LoadingButton from '@mui/lab/LoadingButton';
import { ChangeEventHandler, FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parse, ParseResult } from 'papaparse';
import { ResponseDataExchangeFormat } from '@/interfaces/response';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const ImportResponsesButton: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { importResponses } = useResponses({
    participants: { members: [], assistants: [] },
    round: 0,
  });
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.IMPORT_RESPONSES_BUTTON',
  });

  const handleParsingComplete = (
    results: ParseResult<ResponseDataExchangeFormat>,
  ): void => {
    const { data, errors } = results;
    // eslint-disable-next-line no-console
    errors.forEach((e) => console.warn(e));
    importResponses(data).then(() => setIsImporting(false));
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setIsImporting(true);
    const { files } = event.target;
    if (files !== null) {
      const file = files[0];
      parse(file, { complete: handleParsingComplete, header: true });
    }
  };
  return (
    <>
      <LoadingButton
        onClick={() => fileInputRef.current?.click()}
        loading={isImporting}
        startIcon={<FileUploadIcon />}
      >
        {t('IMPORT_RESPONSES')}
      </LoadingButton>
      <input
        onChange={handleChange}
        multiple={false}
        ref={fileInputRef}
        type="file"
        accept="text/csv"
        hidden
      />
    </>
  );
};

export default ImportResponsesButton;
