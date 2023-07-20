const express = require('express');
const router = express.Router();

const db = require('../../DB/db');

// Create a new listing
router.post('/', (req, res, next) => {
    const newTitle = req.body.title;
    const newBrand = req.body.brand;
    const newImage = req.body.image;
    const newStock = req.body.stock;
    const newPrice = req.body.price;
    const newDisabled = req.body.disabled ? true : false;

    // Check user sign-in status
    if (!req.session.user) {
        res.status(403).send("Not signed-in");
        return;
    }

    // Current user as seller
    const newSeller = req.session.user._id;

    const newReviews = [];

    // Create new phone object (document)s
    const newListingDoc = new db.models.listing({
        title: newTitle,
        brand: newBrand,
        image: newImage,
        stock: newStock,
        seller: newSeller,
        price: newPrice,
        reviews: newReviews,
        disabled: newDisabled
    });

    newListingDoc.save()
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Cannot create listing");
        });
});

// Read all listings
router.get('/', (req, res, next) => {
    // Separate read-all and query
    if (Object.keys(req.query).length != 0)
        return next();

    db.controllers.listing.readAll()
        .then(result => {
            res.send(result)
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Cannot read listings");
        });
});

// Query listings
router.get('/', (req, res, next) => {
    const queryIn = req.query;
    console.log(queryIn);

    // Any query key outside of this list will be omitted for security reasons
    let { seller, keyword, brand, minPrice, maxPrice, showDisabled, topFiveRating, lastFiveStock, ...junk } = queryIn;

    // Type conversion
    minPrice = minPrice != null ? Number(minPrice) : null;
    maxPrice = maxPrice != null ? Number(maxPrice) : null;
    showDisabled = showDisabled == 'true';
    topFiveRating = topFiveRating == 'true';
    lastFiveStock = lastFiveStock == 'true';

    // Top 5 rating and last 5 stock are exclusive
    if (topFiveRating == true && lastFiveStock == true) {
        res.status(400).send("topFiveRating and lastFiveStock cannot be true at the same time.");
        return;
    }

    // Price range must make sense
    if (minPrice != null && maxPrice != null && (Number(minPrice) > Number(maxPrice))) {
        res.status(400).send("minPrice cannot be higher than maxPrice.");
        return;
    }

    // Filter object
    let filter = {};
    if (seller != null) filter.seller = seller;
    if (keyword != null) filter.title = new RegExp(keyword, "i");;
    if (brand != null) filter.brand = brand;

    if (minPrice != null || maxPrice != null)
        filter.price = {};
    if (minPrice != null) filter.price.$gte = minPrice;
    if (maxPrice != null) filter.price.$lte = maxPrice;

    if (!showDisabled) filter.disabled = false;

    // Query DB
    let query = db.models.listing.find(filter);

    // DEBUG
    console.log("Processed query params:", "seller:", seller, "keyword:", keyword, "brand:", brand,
        "minPrice:", minPrice, "maxPrice:", maxPrice, "showDisabled:", showDisabled,
        "topFiveRating:", topFiveRating, "lastFiveStock:", lastFiveStock);
    console.log("Querying: ", query.getFilter(), ", with options: ", query.getOptions());

    query.exec()
        .then(results => {
            if (lastFiveStock) {
                // Filter out listings with 0 stock
                const filtered = results.slice().filter((ele) => ele.stock > 0);
                // Sort by stock, asc
                const sorted = filtered.slice().sort(function (a, b) { return a.stock - b.stock });
                // Take only top 5, or whatever left
                const sliced = sorted.slice(0, Math.min(5, sorted.length));  // .slice() is end-exclusive

                res.send(sliced);
                return;
            } else if (topFiveRating) {
                // Filter listings, only keeping ones with more than 2 reviews
                let filtered = results.slice().filter((ele) => ele.reviews.length >= 2);
                // Calculate averageRating for each listing
                filtered.forEach(listing => {
                    let ratingSum = 0;
                    listing.reviews.map((ele) => ratingSum += ele.rating);
                    listing.avgRating = ratingSum / listing.reviews.length;
                });
                // Sort by average rating, desc
                const sorted = filtered.sort(function (a, b) { return b.avgRating - a.avgRating });
                const sliced = sorted.slice(0, 5);

                res.send(sliced);
                return;
            } else {
                res.send(results);
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Cannot query listings");
        });
});

// Read a listing by its id
router.get('/:listingID', (req, res, next) => {
    const listingID = req.params.listingID;

    db.controllers.listing.read(listingID)
        .then(result => {
            if (!result)
                throw "No result";
            res.send(result);
        })
        .catch(error => {
            console.log(error);
            res.status(404).send("Cannot find listing");
        });
});

// Update a listing
router.put('/:listingID', (req, res, next) => {
    const listingID = req.params.listingID;

    const newTitle = req.body.title;
    const newBrand = req.body.brand;
    const newImage = req.body.image;
    const newStock = req.body.stock;
    const newPrice = req.body.price;
    const newDisabled = req.body.disabled == "true" ? true : false;

    // Check user sign-in status
    if (!req.session.user) {
        res.status(403).send("Not signed-in");
        return;
    }

    // Current user ID for further verification
    const currentUserID = req.session.user._id;

    db.models.listing.findOneAndUpdate({ _id: listingID, seller: currentUserID }, {
        title: newTitle,
        brand: newBrand,
        image: newImage,
        stock: newStock,
        price: newPrice,
        disabled: newDisabled
    }, { new: true })
        .then(result => {
            if (!result)
                throw "No matching listing";
            res.send(result);
        })
        .catch(error => {
            console.log("Error updating listing: ", error);

            if (error == "No matching listing") {
                res.status(404).send(error);
            } else {
                res.status(500).send("Cannot update listing");
            }
        });
});

// Delete a listing
router.delete('/:listingID', (req, res, next) => {
    const listingID = req.params.listingID;

    // Check user sign-in status
    if (!req.session.user) {
        res.status(403).send("Not signed-in");
        return;
    }

    const userID = req.session.user._id;

    db.controllers.listing.read(listingID)
        .then(result => {
            if (!result)
                throw "Cannot find listing document";

            if (result.seller != userID)
                throw "User mismatch"

            return db.controllers.listing.delete(listingID);
        })
        .then(result => {
            // if (result.ok != 1 || result.deletedCount != 1)
            //     throw "Delete failed";

            res.send("DELETED");
        })
        .catch(error => {
            console.log("Error delete listing: ", error);

            if (error == "Cannot find listing document")
                res.status(404).send(error);
            else if (error == "User mismatch")
                res.status(403).send(error);
            else
                res.status(500).send("Cannot delete listing");
        });
});

/* Listings - Reviews */

// Create a review for a listing
router.post('/:listingID/reviews', (req, res, next) => {
    const listingID = req.params.listingID;

    // Check user sign-in status
    if (!req.session.user) {
        res.status(403).send("Not signed-in");
        return;
    }

    const reviewer = req.session.user._id;
    const rating = req.body.rating;
    const comment = req.body.comment;

    if (!rating) {
        res.status(403).send("Rating cannot be empty!");
        return;
    }

    if (!comment) {
        res.status(403).send("Comment cannot be empty!");
        return;
    }

    db.models.listing.findOneAndUpdate({ _id: listingID }, {
        $push: {
            reviews: {
                reviewer: reviewer,
                rating: rating,
                comment: comment
            }
        }
    }, { new: true })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.log("Error saving review: ", error);
            res.status(500).send("Cannot save review");
        });

});

// Read all reviews of a listing
router.get('/:listingID/reviews', (req, res, next) => {
    const listingID = req.params.listingID;

    db.controllers.listing.read(listingID)
        .then(result => {
            if (result == null)
                throw "Cannot find requested listing";
            const reviews = result.reviews;
            res.send(reviews);
        })
        .catch(error => {
            console.log("Error reading review: ", error);

            if (error == "Cannot find requested listing") {
                res.status(404).send("Cannot find requested listing");
                return;
            } else {
                res.status(500).send("Cannot read review");
                return;
            }
        });
});

module.exports = router;
