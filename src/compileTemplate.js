import { join } from 'path';
import Handlebars from 'handlebars';
import { promises } from 'fs';
import { templateFolder, compiledFolder  } from './paths.js';

const addTemplate = async (templateName) => {
  const pathToTemplateDirectory = join(templateFolder, templateName)
  const templateHTMLPath = join(pathToTemplateDirectory, `${templateName}.template.html`);
  const templateFile = await promises.readFile(templateHTMLPath);
  const fileString = templateFile.toString();
  const precompiledPath = join(compiledFolder, `${templateName}.js`);
  const precompiledFileString = Handlebars.precompile(fileString).toString();
  await promises.writeFile(precompiledPath, `export default ${precompiledFileString}`, {encoding: 'utf8'});
}

addTemplate('test')