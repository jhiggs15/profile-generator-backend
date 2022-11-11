# Profile Generator
## Precompiling Profiles
To get the best performance we pre-compile the templates. To precompile a script do the following steps
- npm ci
- change the templateName passed in within compileTemplate.js
- npm run compile
## Running locally
- npm ci
- change the templateName passed in to getPDF.js to a name that has been precompiled
- npm run pdf
## Deploying to Lambda
This generator has been optimized for lambda. To upload 
- npm ci --prod
- zip the entire project (w/ the node modules!)
- upload to AWS