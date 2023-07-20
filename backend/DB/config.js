const {serverAddr, username, password, dbName} = require('./credential')

const config = {
    uri: "mongodb+srv://" + username + ":" + password + "@" + serverAddr + 
        "/" + dbName + "?retryWrites=true&w=majority"
};

module.exports = config;
