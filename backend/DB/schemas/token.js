function getTokenSchema(mongoose) {
    const tokenSchema = new mongoose.Schema({
        token: { type: String, required: true },
        user: { type: String, required: true },
        type: { type: String, required: true }
    });

    return tokenSchema;
}

module.exports = getTokenSchema
