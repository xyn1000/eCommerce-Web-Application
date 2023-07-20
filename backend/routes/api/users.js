const express = require('express');
const router = express.Router();

const md5 = require('md5');

const db = require('../../DB/db');


// Create new user - NOT ALLOWED
router.post('/', (req, res, next) => {
    res.status(400).send("Not allowed - Please use the authentication API to register new account.");
});

// Read profile of user
router.get('/:userID', (req, res, next) => {
    const userID = req.params.userID;

    db.controllers.user.read(userID)
        .then(result => {
            // Filter out password - duh!
            const { password, ...userObject } = result.toObject();
            res.send(userObject);
        })
        .catch(error => {
            console.log("Error querying user: ", error);
            res.status(404).send("Cannot find user");
        });
});

// Update user profile
router.put('/:userID', (req, res, next) => {
    const userID = req.params.userID;
    const { _id, password, ...newUserObj } = req.body;

    // Check user sign-in status
    if (!req.session.user) {
        res.status(403).send("Not signed-in");
        return;
    }

    if (userID != req.session.user._id) {
        res.status(403).send("Editing other user's profile is not allowed.");
        return;
    }

    db.controllers.user.read(userID)
        .then(result => {
            if (result == null) {
                throw "Cannot find user";
            }

            const hashedPasswordIn = md5(password);
            if (hashedPasswordIn != result.password) {
                throw "Password do not match";
            }

            return db.controllers.user.update(userID, newUserObj);
        })
        .then(result => {
            const { password, ...newUserObj } = result.toObject();
            res.send(newUserObj);
        })
        .catch(error => {
            console.log("Error updating user: ", error);
            if (error == "Cannot find this user") {
                res.status(404).send("Cannot find user");
            } else if (error == "Password do not match") {
                res.status(403).send("Password do not match");
            } else {
                res.status(500).send("Cannot update this user");
            }
        });
});

// Delete user - NOT ALLOWED
router.delete('/*', (req, res, next) => {
    res.status(400).send("Not allowed - Deleting account is allowed.");
});

module.exports = router;
