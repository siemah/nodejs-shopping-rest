let mongoose = require('mongoose');
let bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');
let User = require('../../models/user');

exports.signUp = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) res.status(409).json({ message: 'Email exist' })
            else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) res.status(500).json(error);
                    else {
                        let newUser = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        newUser
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({ message: "User create" })
                            })
                            .catch(error => res.status(500).json(error));
                    }
                });
            }
        });
};

exports.login = (req, res, next) => {
    User
        .findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) res.status(409).json({ message: "Auth failed" })
            else {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) return res.status(500).json(error);
                    if (result) {
                        let token = jwt.sign(
                            { email: user.email, id: user._id },
                            "secret",
                            { expiresIn: "1h" }
                        );
                        return res.status(200).json({ message: "Auth succesfull", token });
                    }
                    res.status(409).json({ message: "Auth failed" })
                });
            }
        })
        .catch(error => res.status(500).json(error));
};

exports.delete = (req, res, next) => {
    console.log("-------------------------------", req.params);
    User
        .remove({ _id: req.params._id })
        .exec()
        .then(result => res.status(200).json({ message: 'user has been deleted' }))
        .catch(error => {
            console.log("rmv", error.message);
            res.status(500).json(error)
        })
};