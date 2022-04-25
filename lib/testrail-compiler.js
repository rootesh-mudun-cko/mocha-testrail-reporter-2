const testrail_api = require('./testrail-api');
const _ = require('lodash/collection');
const fse = require('fs-extra');

const constants = require('./testrail-constants');
const helper = require('./testrail-helper');

let connection;

exports.prepareTestRailResults = async (config, tests) =>{
    
    // Create Testrail connection
    connection = testrail_api.init(config);

    // Group all the tests by scenarios
    let scenarioArr = _.groupBy(tests, 'scenarioTitle')

    if(config.debug !== undefined && config.debug){
        saveScenarioArray(scenarioArr);
    };

    await simplifyScenarioList(config, scenarioArr);
}

const simplifyScenarioList = async (config, scenarioArr) =>{
    let testcase_ids = [];
    let results = [];

    // Retrieve reworked testcases from testrail for the SuiteId
    testrail_api.getSimplifiedScenariosList(config, connection).then( simplifedRes => {

        console.log(constants.TESTRAIL_SCENARIOS_IDENTIFED);
        
        simplifedRes.forEach(tr_testcase => {
            //console.log(tr_testcase)
            for (const [scenarioTitle, scenarioArray] of Object.entries(scenarioArr)) {
                //console.log(scenarioArray)
                let featureIndex = scenarioArray.findIndex(scenarioArray_values => scenarioArray_values.grepFeatureTitle == tr_testcase.featureTitle);
                
                // -1 implifies feature was not present in the list of scenarios retrieved from Testrail
                if(featureIndex != -1){ 
                    //console.log(scenarioArray)
                    let featureName = scenarioArray[featureIndex].grepFeatureTitle.trim();
                    
                    if(tr_testcase.title.trim() == scenarioTitle.trim() && tr_testcase.featureTitle.trim() == featureName){
                        //console.log(`${tr_testcase.id} : ${tr_testcase.title}`);
                        
                        results.push(helper.createResults(tr_testcase, scenarioArray, tr_testcase.featureTitle.trim()));
                        testcase_ids.push(tr_testcase.id);
                    }     
                }
            }
        });  

        //List of CasesIds
        console.log(constants.TESTRAIL_LIST_CASEIDS);
        console.log(testcase_ids);

        //console.log(results)
        createTestRun(config, [testcase_ids, results]);
    
    }).catch(err => console.log(err));
};


const createTestRun = async (config, simplifiedResults) => {
    // Array of caseIds
    let case_ids = simplifiedResults[0]; 
    // Array of execution Results
    let executionResults = simplifiedResults[1]; 

    if(executionResults.length == 0) {
        console.log(`${constants.TESTRAIL_TEST_RUN_RESULTS_COMPLETED}`);
        return;
    };

    testrail_api.createTestRun(config, case_ids, connection).then( res => {
        console.log(`${constants.TESTRAIL_TEST_RUN_URL} ${res.url}`);
        addResultsToTestRun(res.id, executionResults);
    }).catch(err => console.log(err));
};

const addResultsToTestRun = async (run_id , executionResults) => {
    await testrail_api.addResultsforRun(run_id , executionResults, connection);
};

async function saveScenarioArray (scenarioArr) {
    console.log(constants.TESTRAIL_SAVE_SCENARIO);
    await fse.outputFile('tmp/scenarioArr.json', JSON.stringify(scenarioArr));
}