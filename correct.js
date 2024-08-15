const mongoose = require("mongoose"); // Require mongoose to handle validation of ObejectId
const models = require("./models");

// Check if valid ObjectId
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Returns the first user found from the given userIds
async function pullFirstUser(userIds) {
    for (let userId of userIds) {
        if (!isValidObjectId(userId)) {
            console.error('Invalid _id provided:', userId);
            continue; // skip to the next iteration
        }

        try {
            let objectId = new mongoose.Types.ObjectId(userId); // Convert to ObjectId
            let user = await models.user.findOne({ _id: objectId });
            
            if (user) {
                console.log("Found user:", user); 
                return user;
            }
        } catch (error) {
            console.error('Error while fetching user:', error);
        }
    }

    // If no user is found
    throw new Error("Not able to find user with provided Ids.");
}
module.exports.pullFirstUser = pullFirstUser;

// Pulls payments for the users and maintains the order
async function pullPaymentsForUsers(users) {
    let result = [];

    for (let user of users) {
        let userIdString = convertToStr(user._id);
        let payments = await models.payment.find({ user: userIdString });
        
        console.log(`Fetching payments for user ID: ${userIdString}`); // Logging the ID being queried
        console.log(`Payments found: ${payments.length}`); // Logging the number of payments found
        
        result.push(payments);
    }

    return result;
}
module.exports.pullPaymentsForUsers = pullPaymentsForUsers;

// Converts ObjectId to string
function convertToStr(value) {
    // If it's a string representation of ObjectId
    if (typeof value === "string" && isValidObjectId(value)) {
        return value; // it's already a string, just return it
    }

    // If it's an ObjectId
    if (value instanceof mongoose.Types.ObjectId) {
        return value.toHexString();
    }

    return null; // Return null if the input isn't an ObjectId or string representation of ObjectId
}
module.exports.convertToStr = convertToStr;

// Returns the payment with the associated user
async function getPaymentWithUser(paymentId) {
    if (!isValidObjectId(paymentId)) {
        console.error('Invalid paymentId provided:', paymentId);
        return null;
    }

    let payment = await models.payment.findOne({ _id: paymentId }).lean(); // Use .lean() to give plain JS Oject instead of Mongoose doc
    if (payment && payment.user && isValidObjectId(payment.user)) {
        payment.userDetails = await models.user.findOne({ _id: payment.user }).lean();
    }
    return payment;
}
module.exports.getPaymentWithUser = getPaymentWithUser;

// Groups payments by user and confirms they are active
async function getGroupedUserPmts(userIds) {
    let validUserIds = userIds.filter(isValidObjectId); // Only use valid ObjectIds
    let result = {};
    
    // Query for payments with the active flag set to true and belong to the provided users
    let allPayments = await models.payment.find({ 
        user: { $in: validUserIds },
        active: true 
    }); 
    
    validUserIds.forEach(userId => {
        result[userId] = allPayments.filter(payment => payment.user.equals(userId));
    });
    
    return result;
}
module.exports.getGroupedUserPmts = getGroupedUserPmts;





