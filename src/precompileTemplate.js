const path = require('path');
const Handlebars = require('handlebars');
const fs = require('fs');

const dirname = path.resolve();
const templatesFolder = path.join(dirname, 'templates')
const precompiledFolder = path.join(dirname, 'precompiled')


const addTemplate = async (templateName) => {
  const pathToTemplateDirectory = path.join(templatesFolder, templateName)
  const templateHTMLPath = path.join(pathToTemplateDirectory, `${templateName}.template.html`);
  const templateFile = await fs.promises.readFile(templateHTMLPath);
  const fileString = templateFile.toString();
  const precompiledPath = `./precompiled/${templateName}.js`;
  const precompiledFileString = Handlebars.precompile(fileString).toString();
  await fs.promises.writeFile(path.join(precompiledFolder, `${templateName}.js`), `module.exports = ${precompiledFileString}`, {encoding: 'utf8'});
}

addTemplate('profile')