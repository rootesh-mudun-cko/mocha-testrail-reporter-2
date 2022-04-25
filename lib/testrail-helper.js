function createResults(testRailScenario, automationScenarioResults, featureTitle){
    let testStatus = 1; // PASS // 5 => Fail
    let comment = 'Test Passed'; 

    automationScenarioResults.forEach((tests, index) =>{
        //console.log(tests);
        //console.log(tests.title);

        if(tests.state == 'failed' && featureTitle == tests.grepFeatureTitle.trim()){
            if(testStatus == 1){
                testStatus = 5;
                comment = tests.errMessage;
            }
            else{
                comment = comment.concat('\n\n', tests.errMessage);
            };
        };
    });

    return {
        "case_id": testRailScenario.id,
        "status_id": testStatus,
        "comment": comment
    };
}

function featureTitle(title){
    return {
        "featureTitle": title.replace(/(\s\@(.*))/g,'')
    };
}

function featureTitleWithGrep(title){
    return {
        "grepFeatureTitle": title.replace(/(\sScenario:.*)/g,'')
    };
}

function scenarioTitle(title,stepTitle){
    title = title.replace(/(.*)(?=Scenario)/g,'');
    return {
        "scenarioTitle": title.replace(stepTitle,'').trim()
    };
}

function normalizeErr(err) {
    return { 
        "errName": err.name,
        "errMessage":err.message,
        "errActual":err.actual,
        "errExpected":err.expected,
        "errStack":err.stack,
        "errShowDiff": err.showDiff
    };
}

// https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
function simplifyJSON (object) {
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return simpleObject; // returns cleaned up JSON
};


module.exports = { 
    simplifyJSON,
    featureTitle,
    scenarioTitle,
    featureTitleWithGrep,
    normalizeErr,
    createResults
} 