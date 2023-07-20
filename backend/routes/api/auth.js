const express = require('express');
const router = express.Router();

const md5 = require('md5');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

const db = require('../../DB/db');


/* Helper functions */

function validatePassword(candidate) {
    const passwordBlackListStrings = [
        " "
    ]

    return !passwordBlackListStrings.some(el => candidate.includes(el));
}

function generateToken() {
    return randomstring.generate({ length: 32, charset: 'alphanumeric' });
}

function sendMail(recipient, content) {
    const subject = content.subject;
    const text = content.text;
    const html = content.html;

    const mailerConfig = {
        host: "smtp.zoho.com.au",
        port: 465,
        secure: true,
        auth: {
            type: 'login',
            user: "no.repley.comp5347.mail.delivery@3000.moe",
            pass: "7Y1HnBaLsEqY"
        }
    };

    const transporter = nodemailer.createTransport(mailerConfig);

    const message = {
        from: "no.repley.comp5347.mail.delivery@3000.moe",
        to: recipient,
        subject: subject,
        text: text,
        html: html
    };

    return transporter.sendMail(message);
}

function sendActivationMail(recipient, token) {
    // Front end landing URL
    const landingURL = "http://localhost:8080/activate-account";

    const link = `${landingURL}?email=${recipient}&token=${token}`;

    const content = {
        subject: "SellPhone Email Verification Link",
        text: `Your SellPhone verification link is: ${link} Please visit the link to activate your account.`,
        html: ` <p><a href="${link}">Click Here</a> to activate your SellPhone account.</p>
                <p>If you cannot click on the link, visit: ${link}</p>` 
    };

    return sendMail(recipient, content);
}

function sendPasswordResetMail(recipient, token) {
    // Front end landing URL
    const landingURL = "http://localhost:8080/reset-password";

    const link = `${landingURL}?email=${recipient}&token=${token}`;

    const content = {
        subject: "SellPhone Password Reset Link",
        text: `Your SellPhone password reset link is: ${link} Please visit the link to reset your password.`,
        html: ` <p><a href="${link}">Click Here</a> to reset your SellPhone account password.</p>
                <p>If you cannot click on the link, visit: ${link}</p>`
    };

    return sendMail(recipient, content);
}

/* Endpoints */

// Sign-in
router.post('/sign-in', (req, res, next) => {
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;

    const hashedPassword = md5(inputPassword);

    db.models.user.findOne({email: inputEmail, password: hashedPassword})
        .then(result => {
            if (result == null) 
                throw 'Wrong combo';
            const {password, ...userObj} = result.toObject();

            // Reject sign-in if not activated
            if (!result.activated)
                throw 'User not activated';

            // Store user object into session
            req.session.user = userObj;

            res.send(userObj);
        })
        .catch(error => {
            console.log("Cannot sign-in: ", error);
            if (error == 'Wrong combo')
                res.status(403).send("Incorrect user email/password!");
            else if (error == 'User not activated')
                res.status(403).send("User not activated!");
            else
                res.status(500).send("Cannot sign in - Internal service error");
        });
});

// Sign-out
router.post('/sign-out', (req, res, next) => {
    // Remove session
    req.session.destroy(err => {
        if (err != null) {
            console.log(err);
            res.status(500).send("Cannot sign out - Internal service error");
        } else {
            res.send("Signed out");
        }
    });
});

// Register
router.post('/register', (req, res, next) => {
    // TODO email verification process
    const userFirstName = req.body.firstName;
    const userLastName = req.body.lastName;
    const userEmail = req.body.email;
    const inputPassword = req.body.password;

    const hashedNewPassword = md5(inputPassword);

    // Check if password meets the rules
    if (!validatePassword(inputPassword)) {
        res.status(400).send("New password does not meet the rules");
        return;
    }

    // Create new user object (document)
    const newUserDoc = new db.models.user({
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        password: hashedNewPassword
    });

    // Save into DB
    newUserDoc.save()
        .then(result => {
            // Email verification token
            const token = generateToken();
            console.log(`Verification token: ${token} for ${result._id}`);

            db.controllers.token.create({ token: token, user: result._id, type: 'registration' })
                .then(_ => {
                    console.log('Verification token saved for', result.email)
                    return sendActivationMail(result.email, token);
                })
                .then(_ => {
                    console.log('Email sent to', result.email);
                })
                .catch(error => console.log(error));

            // Respond user object
            const { password, ...userObj } = result.toObject();
            res.send(userObj);
        })
        .catch(error => {
            console.log(error);
            res.status(403).send("Cannot create user, check your information");
        });
});

// Verify user email (Activate account)
router.get('/activate-account', (req, res, next) => {
    const email = req.query.email;
    const token = req.query.token;

    // Find corresponding user
    db.models.token.findOneAndDelete({ token: token, type: 'registration' })
        .then(tokenResult => {
            if (tokenResult == null)
                throw "Token do not exist";
            userIDToActivate = tokenResult.user;

            return db.models.user.findOneAndUpdate({ _id: db.mongoose.Types.ObjectId(userIDToActivate), email: email }, { activated: true }, { new: true })
        })
        .then(updateUserResult => {
            if (updateUserResult == null)
                throw "Cannot find user";
            
            res.send("User activated");
        })
        .catch(error => {
            console.log('Error verifying email:', error);
            res.status(500).send("Cannot activate user");
        });
});

// Re-send verification email
router.get('/resend-email', (req, res, next) => {
    const email = req.query.email;

    let userIDToActivate = "";
    let newToken = "";

    // Get user
    db.models.user.findOne({ email: email, activated: false })
        .then(userResult => {
            if (userResult == null)
                throw "Cannot find user";
            
            userIDToActivate = userResult._id;

            // Re-generate token
            newToken = generateToken();
            console.log(`Verification token: ${newToken} for ${userIDToActivate}`);

            return db.models.token.findOneAndUpdate({ user: userIDToActivate, type: 'registration' }, { token: newToken }, { new: true })
        })
        .then(updateTokenResult => {
            let promiseQueue = [];
            // In unlikely cases where token record was lost
            if (updateTokenResult == null) {
                promiseQueue.push(db.controllers.token.create({ user: userIDToActivate, type: 'registration', token: newToken }));
            }

            promiseQueue.push(sendActivationMail(email, newToken));

            return Promise.all(promiseQueue);
        })
        .then(finalResult => {
            res.send('Email sent');
        })
        .catch(error => {
            console.log('Error resending email:', error);
            res.status(500).send("Cannot resend verification email");
        });
});

// Change password
router.post('/change-password', (req, res, next) => {
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;
    const hashedPassword = md5(inputPassword);

    const inputNewPassword = req.body.newPassword;

    // Check if password meets the rules
    if (!validatePassword(inputNewPassword)) {
        res.status(400).send("New password does not meet the rules");
        return;
    }

    const hashedNewPassword = md5(inputNewPassword);

    db.models.user.findOneAndUpdate(
            {email: inputEmail, password: hashedPassword},
            {$set: {password: hashedNewPassword}}
        ).then(result => {
            if (result == null) 
                throw(`Cannot find user: ${inputEmail} with given password`);
            
            const {password, ...userObj} = result.toObject();
            res.send(userObj);
        })
        .catch(error => {
            console.log('Error changing password:', error);
            res.status(403).send("Incorrect user email/password!");
        });
});

// TODO Request password reset
router.get('/request-password-reset', (req, res, next) => {
    const email = req.query.email;

    const token = generateToken();

    db.models.user.findOne({ email: email })
        .then(userResult => {
            if (!userResult)
                throw "Cannot find user";
            
            const userIDRequestingReset = userResult._id;

            return db.controllers.token.create({ user: userIDRequestingReset, token: token, type: 'resetPassword' });
        })
        .then(tokenResult => {
            return sendPasswordResetMail(email, token);
        })
        .then(emailResult => {
            res.send('Reset password link sent');
        })
        .catch(error => {
            console.log('Error requesting password reset:', error);
            res.status(500).send("Cannot request password reset");
        });
})

// Reset password
router.post('/reset-password', (req, res, next) => {
    const email = req.query.email;
    const token = req.query.token;

    const newPassword = req.body.newPassword;

    if (!email || !token) {
        res.status(400).send('Illegal arguments');
        return;
    }

    if (!validatePassword(newPassword)) {
        res.status(400).send("New password does not meet the rules");
        return;
    }

    const hashedNewPassword = md5(newPassword);

    db.models.token.findOneAndDelete({ token: token, type: 'resetPassword' })
        .then(tokenResult => {
            if (!tokenResult) 
                throw "Token not found";
            
            const userIDToReset = tokenResult.user;

            return db.models.user.findOneAndUpdate({ _id: userIDToReset, email: email }, { password: hashedNewPassword }, { new: true });
        })
        .then(updatePasswordResult => {
            if (!updatePasswordResult)
                throw "User do not exist";
            
            res.send('Password reset successful');
        })
        .catch(error => {
            console.log('Error resetting password', error);
            res.status(500).send("Cannot reset user password");
        });
});

module.exports = router;