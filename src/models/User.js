const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({

    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    gender: String,
    birthdate: Date,
    image: String,

    adresses: [{
        zip_code: String,
        street: String,
        number: Number,
        comp: String,
        state: String,
        city: String
    }]


}, {
        timestamps: true
    })

UserSchema.pre('save', function (next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = async (candidatePassword, hashedPassword, callback) => {
    await bcrypt.compare(candidatePassword, hashedPassword, function (err, isMatch) {
        if (err) {
            return callback(err)
        } else {
            callback(undefined, isMatch)
        }
    })
}

module.exports = mongoose.model('User', UserSchema)