function getListingModel(mongoose, schema) {
    const model = mongoose.model('listing', schema);

    return model;
};

module.exports = getListingModel
