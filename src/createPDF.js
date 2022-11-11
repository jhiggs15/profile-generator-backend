// require syntax so we can easily precompile templates
// by default handlebar precompiles scrips with require, and
// for the sake of automation I didnt replace this with ES6
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Handlebars = require('../handlebars.runtime.js');
const profileTemplate = require('../precompiled/profile.js')

const dirname = path.resolve();
const templatesFolder = path.join(dirname, 'templates')
// NOTE: use 512MB for aws lambda function
const getPDF = async (templateName, data) => {
  // create page on headless chrome browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const pathToTemplateDirectory = path.join(templatesFolder, templateName)
  // add data into pre-compiled template and convert to HTML string
  const template = Handlebars.template(profileTemplate);
  const compiledTemplate = template(data);
  // write out compiled file so we can use goto method
  // this avoids previously encountered error of having to store base64 encodings
  // within html
  const tempFilePath = path.join(pathToTemplateDirectory, `${templateName}.temp.html`);
  await fs.promises.writeFile(tempFilePath, compiledTemplate);
  // create pdf
  await page.goto(tempFilePath, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({format: "A4"});
  await fs.promises.writeFile(`./${templateName}.pdf`, pdf);
  // remove created template
  await fs.promises.rm(tempFilePath);

  browser.close();
  return pdf
}

const data = {
  name: 'John Higgs',
  title: 'Mr.'
}
getPDF("profile", data)