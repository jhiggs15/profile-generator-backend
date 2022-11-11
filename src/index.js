import {createPDF} from './createPDF';

const pdfLambdaHandler = async (event, context, callback) => {
  const data = {
    name: 'John Higgs',
    title: 'Software Developer'
  }
  await getPDF("test", data);
}

export default pdfLambdaHandler;
