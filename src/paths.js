import { resolve, join } from 'path';

const dirname = resolve();
const templateFolder = join(dirname, 'profiles', 'templates')
const compiledFolder = join(dirname, 'profiles', 'compiled')

export {
  dirname,
  templateFolder,
  compiledFolder
}