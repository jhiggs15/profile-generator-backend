import { join } from 'path';
import { promises } from 'fs';
import { createPDF, dirname } from './index.js';

const data = {
  name: 'John Higgs',
  title: 'Software Developer'
}
const templateName = "test";

const pdf = await createPDF(templateName, data);
const destination = join(dirname, 'profiles', 'output', `${templateName}.pdf`);
await promises.writeFile(destination, pdf);
