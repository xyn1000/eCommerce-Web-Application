function getListingSchema(mongoose) {
    const listingSchema = new mongoose.Schema({
        title: { type: String, required: true },
        brand: { type: String, required: true },
        image: { type: String, required: true },
        stock: { type: Number, required: true },
        seller: { type: String, required: true },
        price: { type: Number, required: true },
        reviews: [{
            reviewer: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true }
        }],
        disabled: { type: Boolean }
    });

    return listingSchema;
}

module.exports = getListingSchema
