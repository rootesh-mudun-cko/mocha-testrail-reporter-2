//https://github.com/antonk52/lilconfig
const lilconfig = require('lilconfig');

const options = {
    searchPlaces: ['testrail.json'],
    ignoreEmptySearchPlaces: true
}

const mocha = {
    searchPlaces: ['mocha.json','test/mocha.json'],
    ignoreEmptySearchPlaces: true
}

const version = {
    searchPlaces: ['version.js'],
    ignoreEmptySearchPlaces: true
}
// Testrail Config
function searchConfig(){
    return lilconfig.lilconfigSync("testrail", options).search();
}

function validateConfigOptions (config, field) {
    if (config == null) throw new Error("Unable to find testrail.json! Please add the file!");
    
    if (config['config'][field] == null || (config['config'][field]).length == 0) {
        console.log("testrail.json:");
        console.log(config);
        throw new Error(`Incorrect value for ${field}. Please update testrail.json!`);
    };
}

// Mocha Config
function searchMocha(){
    updateMocha()
    return lilconfig.lilconfigSync("mocha", mocha).search();
}

function updateMocha(){
    const _config = searchConfig().config;
    if(_config.mocha != undefined && _config.mocha != ''){
        mocha.searchPlaces.push(_config.mocha);
    }
}

// Versioning Config
function searchVersion(){
    updateVersioning()
    return lilconfig.lilconfigSync("version", version).search();
}

function updateVersioning(){
    const _config = searchConfig().config;
    if(_config.version != undefined && _config.version != ''){
        version.searchPlaces.push(_config.version);
    }
}
  
module.exports = {
    searchConfig,
    validateConfigOptions,
    searchMocha,
    searchVersion
};
