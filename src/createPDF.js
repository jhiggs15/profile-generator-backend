import { join } from 'path';
import chromium from 'chrome-aws-lambda';
import { promises } from 'fs';
import * as Handlebars  from '../handlebars.runtime.cjs';
import profileTemplate from '../profiles/compiled/test.js';
import { dirname, templateFolder } from './paths.js';

// NOTE: use 512MB for aws lambda function
const getPDF = async (templateName, data) => {
  // create page on headless chrome browser
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    // change headless to false to see what is being brought up on the page
    headless: true,
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  const pathToTemplateDirectory = join(templateFolder, templateName)
  // add data into pre-compiled template and convert to HTML string
  const precompiledTemplate = Handlebars.template(profileTemplate);
  const templateWithData = precompiledTemplate(data);
  // write out compiled file so we can use goto method
  // this avoids previously encountered error of having to store base64 encodings
  // within html
  const tempFilePath = join(pathToTemplateDirectory, `${templateName}.temp.html`);
  await promises.writeFile(tempFilePath, templateWithData);
  // create pdf
  await page.goto(tempFilePath, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({format: "A4"});
  // remove created template
  await promises.rm(tempFilePath);
  browser.close();
  return pdf
}

const data = {
  name: 'John Higgs',
  title: 'Software Developer'
}
const templateName = "test";

const pdf = await getPDF(templateName, data);
const destination = join(dirname, 'profiles', 'output', `${templateName}.pdf`);
await promises.writeFile(destination, pdf);
