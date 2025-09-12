import { saveAs } from 'file-saver';
import cloneDeep from 'lodash.clonedeep';
import Papa from 'papaparse';

import {
  ResponseData,
  ResponseDataExchangeFormat,
  ResponseEvaluation,
} from '@/interfaces/response';

const exportResponses = async (
  responses: Array<ResponseData<ResponseEvaluation>>,
): Promise<void> => {
  const responsesToExport = cloneDeep(responses);
  const extractedData = responsesToExport.map((responseAppData, index) => {
    // const evaluation = responseAppData?.evaluation;
    try {
      // eslint-disable-next-line no-param-reassign
      delete responseAppData.evaluation;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
    const dataToExport: ResponseDataExchangeFormat = {
      ...responseAppData,
      id: index,
    };
    // if (typeof evaluation !== 'undefined') {
    //   if ('votes' in evaluation) {
    //     dataToExport.votes = evaluation.votes;
    //   }
    // }
    return dataToExport;
  });
  const csv = Papa.unparse(extractedData);
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  saveAs(csvBlob, 'responses.csv');
};

export default exportResponses;
