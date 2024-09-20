import { ResponseAppData } from '@/config/appDataTypes';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { ResponseData, ResponseEvaluation } from '@/interfaces/response';
import cloneDeep from 'lodash.clonedeep';

const exportResponses = async (
  responses: Array<ResponseAppData<ResponseEvaluation>>,
): Promise<void> => {
  const responsesToExport = cloneDeep(responses);
  const extractedData = responsesToExport.map((responseAppData, index) => {
    const evaluation = responseAppData.data?.evaluation;
    try {
      // eslint-disable-next-line no-param-reassign
      delete responseAppData.data.evaluation;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
    const dataToExport: ResponseData<ResponseEvaluation> & {
      id: number;
      votes?: number;
    } = {
      ...responseAppData.data,
      id: index,
    };
    if (typeof evaluation !== 'undefined') {
      if ('votes' in evaluation) {
        dataToExport.votes = evaluation.votes;
      }
    }
    return dataToExport;
  });
  const csv = Papa.unparse(extractedData);
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  saveAs(csvBlob, 'responses.csv');
};

export default exportResponses;
