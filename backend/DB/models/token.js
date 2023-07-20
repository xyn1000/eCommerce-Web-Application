function getTokenModel(mongoose, schema) {
    const model = mongoose.model('token', schema);

    return model;
};

module.exports = getTokenModel
