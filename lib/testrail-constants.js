const colors = require('colors');

exports.TESTRAIL_ENABLED = "[Testrail] Results collection started".yellow;
exports.TESTRAIL_DISABLED = "[Testrail] Results collection disabled".yellow;
exports.TESTRAIL_PROCESSING_RESULTS = "[Testrail] Processing in progress, please wait!".yellow;
exports.TESTRAIL_USING_CONFIG = "[Testrail] Using Config:".yellow;
exports.TESTRAIL_SCENARIOS_IDENTIFED = "[Testrail] List of Scenarios identified:".yellow;
exports.TESTRAIL_SCENARIOS_LIST = "[Testrail] Retrieving List of all Scenarios from Suite:".yellow;
exports.TESTRAIL_LIST_CASEIDS = "[Testrail] CaseIds Identified:".yellow;
exports.TESTRAIL_CREATE_NEW_TEST_RUN = "[Testrail] Creating a new run for SuiteId:".yellow;
exports.TESTRAIL_TEST_RUN_URL = "[Testrail] Link for Testrun:".yellow;
exports.TESTRAIL_TEST_RUN_RESULTS_COMPLETED = "[Testrail] Completed!".green;
exports.TESTRAIL_SAVE_SCENARIO = "[DEBUG_MODE] Scenario List saved to tmp/scenarioArr.json".magenta;