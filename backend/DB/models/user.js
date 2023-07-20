function getUserModel(mongoose, schema) {
    const model = mongoose.model('user', schema);

    return model;
};

module.exports = getUserModel
