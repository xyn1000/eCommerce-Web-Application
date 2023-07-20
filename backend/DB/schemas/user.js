function getUserSchema(mongoose) {
    const userSchema = new mongoose.Schema({
        // Legacy issue, see {ProjectRoot}/readme.md
        firstname: { type: String },
        lastname: { type: String },
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        activated: { type: Boolean }
    });

    return userSchema;
}

module.exports = getUserSchema
