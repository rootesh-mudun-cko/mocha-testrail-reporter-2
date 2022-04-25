const mocha = require('mocha');
const _ = require('lodash/collection');

// helpers
const helper = require('./testrail-helper');
const config = require('./config');
const constants = require('./testrail-constants');
const testrail_compiler = require('./testrail-compiler');

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS
} = mocha.Runner.constants;


class mochaTestRailReporter {
  constructor(runner) {
    // Ensure Reporter options initialized correctly
    const testrailConfig = config.searchConfig();
    ["host","email","apikey","testrail_enabled","project_name","project_id","suite_id"].forEach((field) => config.validateConfigOptions(testrailConfig, field));

    let tests = [];
    
    runner
        .once(EVENT_RUN_BEGIN, () => {
            console.log(`${constants.TESTRAIL_USING_CONFIG} ${testrailConfig.filepath}`);
            (testrailConfig.config["testrail_enabled"]) ? console.log(constants.TESTRAIL_ENABLED) : console.log(constants.TESTRAIL_DISABLED);     
        })

        .on(EVENT_TEST_PASS, test => {
            if(!testrailConfig.config["testrail_enabled"]) return;
            tests.push(refactorResults(test,true));
            //console.log(tests)
        })
            
        .on(EVENT_TEST_FAIL, (test, err) => {
            if(!testrailConfig.config["testrail_enabled"]) return;
            tests.push(refactorResults(test,false));
            //console.log(tests)
          })

        .on(EVENT_RUN_END, () => {
          if(!testrailConfig.config["testrail_enabled"]) return;

          // Blocks testrail processing if no tests were executed!
          if(tests.length == 0) {
            console.log(`${constants.TESTRAIL_TEST_RUN_RESULTS_COMPLETED}`);
            return;
          }

          console.log(constants.TESTRAIL_PROCESSING_RESULTS);
          testrail_compiler.prepareTestRailResults(testrailConfig.config, tests);
        });
  }
}

module.exports = mochaTestRailReporter;

function refactorResults (test, passed) {
  // Test#fullTitle() returns the suite name(s)
  // console.log(`Feature Title: ${test.fullTitle()}`); 

  // https://www.javascripttutorial.net/object/javascript-merge-objects/
  // Using spread operator, include the Feature title and the Scenario title in the Test Object
  
  let simplifiedTest = helper.simplifyJSON(test);

  if(passed){
    simplifiedTest = {
      title : simplifiedTest["title"], 
      body : simplifiedTest["body"],  
      uuid: simplifiedTest["uuid"], 
      state: simplifiedTest["state"],
      ...helper.featureTitle(test.fullTitle()), // this gets the feature title for the test
      ...helper.scenarioTitle(test.fullTitle(), test.title), // this gets the scenario title for the test - also takes to inputs, the main text + the step title (which is removed)
      ...helper.featureTitleWithGrep(test.fullTitle()),
    };
    //console.log(simplifiedTest);
  }else{
    simplifiedTest = {
      title : simplifiedTest["title"], 
      body : simplifiedTest["body"],  
      uuid: simplifiedTest["uuid"], 
      state: simplifiedTest["state"], 
      ...helper.featureTitle(test.fullTitle()), // this gets the feature title for the test
      ...helper.scenarioTitle(test.fullTitle(), test.title), // this gets the scenario title for the test - also takes to inputs, the main text + the step title (which is removed)
      ...helper.featureTitleWithGrep(test.fullTitle()),
      ...helper.normalizeErr(test.err) // Gets the error from the the test object and returns it into a new object
    };

    //console.log(helper.normalizeErr(test.err))
    //console.log(simplifiedTest);
  }

  return simplifiedTest;
}