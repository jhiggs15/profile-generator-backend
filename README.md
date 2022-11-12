# Profile Generator
A note that dev dependecies are used to run the project locally and production dependecies are used to run the project on lambda. The differnce is that on lambda we use a lighter weight version of chromium.
## Running locally
### Precompiling Profiles
To get the best performance we pre-compile templates. Templates must be precompiled before they are usable. To precompile a template do the following steps
- `npm ci --dev`
- change the templateName passed in within compileTemplate.js
- `npm run compile`
### Creating PDF
Once a profile has been precompiled we can make a pdf from it. To make a template do the following steps
- `npm ci --dev`
- change the templateName passed in to getPDF.js to the name a template name that has been precompiled
- `npm run pdf`
- The pdf now appears within profiles/output/TEMPLATENAME.pdf
## Lambda
### Deploying to Lambda
To prepare the files run
- `npm ci --prod`

For this to work the configured lambda instance must be
- running the Node.js 14.x runtime
- the handler must be set to src/index.pdfLambdaHandler
- the memory must be set to 512mb or greater
- the timeout should be bumped to 2 minutes

Since the code is bigger than 50mb we must zip the files and upload them to a S3 bucket and make the lambda refernce the zips location via its S3 URI. A gotcha I encoutnered with this is you must zip the projects contents only and not the directory they exist within (don't zip the Profile-Generator-Backend folder).
### Testing on Lambda
Once the function has been deployed run the following script in a terminal with 
curl (for me this was git bash).

`curl --request POST INSERT_LAMBDA_FUNCTION_URL --header "Conent-Type: application/json" --data '{"templateName": "test", "data": {"name": "John Higgins", "title": "Software"}}' -k`

The result will be a an Array of bytes which we can save as a PDF!
