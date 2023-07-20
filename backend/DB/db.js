const mongoose = require('mongoose');
const config = require('./config');

const schemas = {
    user: require('./schemas/user')(mongoose),
    listing: require('./schemas/listing')(mongoose),
    token: require('./schemas/token')(mongoose)
};

const models = {
    user: require('./models/user')(mongoose, schemas.user),
    listing: require('./models/listing')(mongoose, schemas.listing),
    token: require('./models/token')(mongoose, schemas.token)
};

const controllers = {
    user: require('./controllers/CRUDcontroller')(models.user),
    listing: require('./controllers/CRUDcontroller')(models.listing),
    token: require('./controllers/CRUDcontroller')(models.token)
}

// Establish connection
mongoose
    .connect(config.uri)
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(err => {
        console.log("Cannot connect to the database", err);
        process.exit();
    });

const DB = {
    mongoose: mongoose,
    uri: config.uri,
    schemas: schemas,
    models: models,
    controllers: controllers
}

module.exports = DB;
