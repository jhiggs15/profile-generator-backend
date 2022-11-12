import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { promises } from 'fs';
import { resolve, join } from 'path';
import * as Handlebars  from '../handlebars.runtime.cjs';
import profileTemplate from '../profiles/compiled/test.js';

const dirname = resolve();
const templateFolder = join(dirname, 'profiles', 'templates')
const compiledFolder = join(dirname, 'profiles', 'compiled')

// NOTE: use 512MB for aws lambda function
const createPDF = async (templateName, data, isLambda=false) => {
  const execPath = await chromium.executablePath;
  // create page on headless chrome browser
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: execPath,
    // change headless to false to see what is being brought up on the page
    headless: true,
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  // add data into pre-compiled template and convert to HTML string
  const precompiledTemplate = Handlebars.template(profileTemplate);
  const templateWithData = precompiledTemplate(data);
  // write out compiled file so we can use goto method
  // this avoids previously encountered error of having to store base64 encodings
  // within html
  let pathToTemplateDirectory = join(templateFolder, templateName)
  if (isLambda) pathToTemplateDirectory = '/tmp'
  const tempFilePath = join(pathToTemplateDirectory, `${templateName}.temp.html`);
  await promises.writeFile(tempFilePath, templateWithData);
  // create pdf
  await page.goto(`file://${tempFilePath}`, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({format: "A4"});
  // remove created template
  await promises.rm(tempFilePath);
  browser.close();
  return pdf
}

const pdfLambdaHandler = async (event) => {
  try {
    const bodyString = Buffer.from(event.body, "base64").toString();
    const templateInfo = JSON.parse(bodyString);
    console.log(`Template Info\n${JSON.stringify(templateInfo)}`);
    const pdf = await createPDF(templateInfo.templateName, templateInfo.data, true);
    return {
      statusCode: 200,
      body: {
        pdf
      }
    }
  } catch(error) {
    if (error instanceof Error) {
      console.log(`Error\n${error.message}`);
      return {
        statusCode: 500,
        body: {
          message: error.message
        }
      }
    }
    return {
      statusCode: 501,
      body: {
        message: 'Unknown Error'
      }
    }

  }

}

export {
  createPDF,
  pdfLambdaHandler,
  dirname,
  templateFolder,
  compiledFolder
}

