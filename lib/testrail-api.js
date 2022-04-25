//import TestRail from '@dlenroc/testrail';
const TestRail = require('@dlenroc/testrail');
const _ = require('lodash/collection');

const constants = require('./testrail-constants');
const _config = require('./config');

exports.init = (config) =>{
    return new TestRail({
        host: config.host,
        username: config.email,
        password: config.apikey
    })
}

exports.addResultsforRun = async (run_id, results, _api) => {

    console.log(constants.TESTRAIL_TEST_RUN_RESULTS_COMPLETED);

    let payload = {
        results : results
    };

    // console.log(payload)
    return await _api.addResultsForCases(run_id, payload);
}

exports.createTestRun = async (config, case_ids, _api) => {

    let uniqueIdentifer = Math.random().toString(36).substring(2,7).toString().toUpperCase();
    let name_of_run = `[GREP_HERE][VERSION_HERE] ${config.project_name}_${uniqueIdentifer}`;

    console.log(`${constants.TESTRAIL_CREATE_NEW_TEST_RUN} ${config.suite_id}`);    

    let payload = {
        "suite_id": config.suite_id,
        "name": await testrunName(name_of_run),
        "include_all": false,
        "case_ids": case_ids
    }
    return await _api.addRun(config.project_id, payload);
}

exports.getSimplifiedScenariosList = async (config, _api) =>{
    
    console.log(`${constants.TESTRAIL_SCENARIOS_LIST} ${config.suite_id}`);
    let payload = {
        "suite_id": config.suite_id
    }

    let newCasesList = [];
    let testCases = await _api.getCases(config.project_id, payload);
    let sections = await _api.getSections(config.project_id, payload);

    sections.forEach(section => {
        //console.log(section.id)
        //console.log(section.name)
        testCases.forEach(tcase=> {
            if(section.id == tcase.section_id){
                //console.log(tcase.title);
                newCasesList.push({
                    id: tcase.id,
                    title: tcase.title,
                    section_id: tcase.section_id,
                    suide_id: tcase.suite_id,
                    featureId: section.id,
                    featureTitle: section.name
                })
            }                            
        })
    });

    return newCasesList;
}

// Test Name + GREP FROM MOCHA + VERSIONING
async function testrunName (name_of_run) {

    let mocha = _config.searchMocha();
    if(mocha != null && !mocha.config.grep !== undefined){
        // Check Grep here
        // console.log(mocha.config.grep);
        name_of_run = name_of_run.replace('GREP_HERE', mocha.config.grep)
    }

    let version =  _config.searchVersion();
    if(version != null && !version.config.version !== undefined){
        let _version = await version.config.version();

        // Check version here
        // console.log(_version);
        name_of_run = name_of_run.replace('VERSION_HERE', _version);
    };

    name_of_run = name_of_run.replace('[GREP_HERE]', '');
    name_of_run = name_of_run.replace('[VERSION_HERE]', '');

    return name_of_run;
}