/* Contains all models for incorrect.js */

const mongoose = require("mongoose"),
      Schema = mongoose.Schema;

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connection = mongoose.createConnection("mongodb://127.0.0.1:27017/clerkie_challenge", connectionOptions);

module.exports.mongoose = mongoose;
module.exports.connection = connection;  // Exposing the connection so I can close it later

let userSchema = new Schema({
    active: {type: Boolean, default: true},
    signup_date: Date,

    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports.user = connection.model("User", userSchema);

let paymentSchema = new Schema({
    name: String,
    active: {type: Boolean, default: true},
    amount: Number,
    date: Date,
    user: {type: Schema.Types.ObjectId, ref: "User"},

    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});
module.exports.payment = connection.model("Payment", paymentSchema);
