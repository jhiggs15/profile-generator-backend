import path from 'path';
import puppeteer from 'puppeteer';
import fs from 'fs';

const dirname = path.resolve();
const templatesFolder = path.join(dirname, 'templates')

const getPDF = async (templateName) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${templatesFolder}/${templateName}/${templateName}.html`, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({format: "A4"});
  await browser.close();
  await fs.promises.writeFile(`./${templateName}.pdf`, pdf);
  return pdf
}


getPDF("profile")