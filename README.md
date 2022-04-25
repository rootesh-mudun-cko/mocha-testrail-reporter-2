# mocha-testrail-reporter-2
This library allows to testrail to be integrated to a mocha automation suite as a mocha reporter. 

## Pre-requisites
- Requires `mochawesome-report-generator` to be present on the suite, in which the `mochawesome.json` file generated will be used to extract testcases to be uploaded to Testrail. ( Extractor tool added to [releases](https://github.com/rootesh-mudun-cko/mocha-testrail-reporter-2/releases). )

- Using `multi-custom-reporter` will allow both reporters work together.


## Installation
Using NPM:
```sh
npm i mocha-testrail-reporter-2
```


### Add reporter to mocha.json
1. Standalone using mocha-testrail-reporter-2.
```json
{
  ...,
  "reporter": ["mocha-testrail-reporter-2"],
  "reporter-options" : "",
  ...
}
```

2. i. Using `multi-custom-reporter` (Recommended)

```json
{
  ...,
  "reporter": ["mocha-multi-reporters"],
  "reporter-options" : "configFile=config.json",
  ...
}
```

2. ii. Add `config.json` to root directory of your automation suite if using `multi-custom-reporter`.

```json
{
  "reporterEnabled": "mochawesome, mocha-testrail-reporter-2",
  "mochawesomeReporterOptions": {
      "reportDir": "./artifacts"
  }
}
```

#### Note
Do not forget to install mochawesome & mocha-multi-reporters as dependency.

Please read [mochawesome](https://github.com/adamgruber/mochawesome-report-generator) & [mocha-multi-reporters](https://github.com/stanleyhlng/mocha-multi-reporters) documentations if anything unclear.

### Extracting & uploading testcases to Testrail
On the [releases](https://github.com/rootesh-mudun-cko/mocha-testrail-reporter-2/releases) section, there is the "mochawesome extractor tool" attached and has all the steps detailed on how to use the tool.

On testrail, create your project, followed by suite and import testcases using the the "Import using csv" option.

### Testrail configuration 
Create a 'testrail.json' json file on the root directory of the project with the following:
```json
{
  "host": "https://yourtestrail.domain.here",
  "email": "email@address.here",
  "apikey": "your_testrail_api_key_here",
  "project_name": "Demo Project Name",
  "project_id": 1,
  "suite_id": 1,
  "testrail_enabled": false,
  "mocha": "--optional field", 
  "version": "--optional field" 
}
```

### Configuration options

**host**: [*string*] Domain name of the Testrail domain (e.g. domain.testrail.io)

**email**: [*string*] Username/Email for the testrail account

**apikey**: [*string*] password or API token for user account

**project_name**: [*number*] name of project for which the Testrun will be created

**projectId**: [*number*] project number where the suite has been added

**suite_id**: [*number*] suite number where the tests have been uploaded

**testrail_enabled**: [*boolean*] disable/enable testrail for the automation suite

**mocha**: [*string*] (optional) set path for the 'mocha.json' file, used to retrieve the grep value. (default path is root directory of project or ./test/mocha.json)

**version**: [*string*] (optional) set path where a version function can be defined to return a version of the Automation suite (default path is root directory of project)

### Configuration example for the `mocha` options

Configure `mocha` path to be present at `config/mocha.json`. (Not required if file is present at root directory of project or at `./test/mocha.json`)
```json
{
  ...,
  "mocha": "config/mocha.json",
}
```

### Configuration example for the `version` options

Define `version.js` path to be present at `config/version.js`. (Not required if file is present at root directory of project)

```json
{
  ...,
  "version": "config/version.js",
}
```

1. Returning a static version 
```javascript
exports.version = async () => {
    return "1.0.0";
}

```

2. Returning a dynamic version using a request via superagent. Example using https://reqres.in/api/users/1
```javascript
let request = require("supertest");

exports.version = async () => {
    try
    {
        return request("https://reqres.in")
          .get("/api/users/1")
          .then(async function (response) {
            return response.body['data']['id'] != undefined ? response.body['data']['id'] : 'undefined';
          });
    }
    catch(err)
    {
        return 'Error in code versioning logic';
    };
};

```

### Testail Execution on CLI & Testrail
![image](https://user-images.githubusercontent.com/78484269/165096287-3a454576-2ab2-488e-a707-90ddfb683083.png)

![image](https://user-images.githubusercontent.com/78484269/165097824-e4edafcd-ab5c-409d-88a7-fabf5adb577c.png)

![image](https://user-images.githubusercontent.com/78484269/165096410-b7a773e9-bbf9-4c09-a8e9-cf4e81fc12da.png)

### Failed tests results on Testrail
![image](https://user-images.githubusercontent.com/78484269/165096817-e3338dbd-26d8-4eb9-a996-5f0ae2089edf.png)

### Testrail Run with `mocha` defined
![image](https://user-images.githubusercontent.com/78484269/165097368-41acdeac-1020-4f0a-9dc7-19dff5689e5e.png)

### Testrail Run with `version` defined 
![image](https://user-images.githubusercontent.com/78484269/165097566-dce6d77e-675e-4136-a0e2-12f76fbb7e6e.png)

### Testrail Run with `mocha` & `version` defined 
![image](https://user-images.githubusercontent.com/78484269/165097748-ec719467-5e3f-4e0e-b5fb-9b31973781de.png)


