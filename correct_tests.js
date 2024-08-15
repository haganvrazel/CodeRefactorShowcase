/* These tests were done with following items in the database:

User1 - (was assigned _id: 64e04a7362bbc82763b078f4):
  {
    active: true, (bool)
    signup_date: 2023-08-18T00:00:00.000Z, (str)
    created: 2023-08-18T00:00:00.000Z, (str)
    updated: 2023-08-18T00:00:00.000Z (str)
  }

User2 - (was assinged _id: 64e04af162bbc82763b078f9)
  {
    active: true, (bool)
    signup_date: 2023-08-19T00:00:00.000Z, (str)
    created: 2023-08-19T00:00:00.000Z, (str)
    updated: 2023-08-19T00:00:00.000Z (str)
  }

  User1 has the following payments (2 active & 1 inactive):
    {
      active: true, (bool)
      name: 'Payment 1 for User 1', (str)
      amount: 100, (int32)
      date: 2023-08-18T01:00:00.000Z, (str)
      user: 64e04a7362bbc82763b078f4, (ObjectId)
      created: 2023-08-18T01:00:00.000Z, (str)
      updated: 2023-08-18T01:00:00.000Z (str)
    },

    {
      active: true, (bool)
      name: 'Payment 2 for User 1', (str)
      amount: 150, (int32)
      date: 2023-08-19T02:00:00.000Z, (str)
      user: 64e04a7362bbc82763b078f4, (ObjectId)
      created: 2023-08-19T02:00:00.000Z, (str)
      updated: 2023-08-19T02:00:00.000Z (str)
    },

    {
      active: false, (bool)
      name: 'Inactive Payment for User 1', (str)
      amount: 50, (int32)
      date: 2023-08-22T05:00:00.000Z, (str)
      user: 64e04a7362bbc82763b078f4, (ObjectId)
      created: 2023-08-22T05:00:00.000Z, (str)
      updated: 2023-08-22T05:00:00.000Z (str)
    }

    User2 has the following payments (2 active & 0 inactive):
    {
      active: true, (bool)
      name: 'Payment 1 for User 2', (str)
      amount: 120, (int32)
      date: 2023-08-20T03:00:00.000Z, (str)
      user: 64e04af162bbc82763b078f9, (ObjectId)
      created: 2023-08-20T03:00:00.000Z, (str)
      updated: 2023-08-20T03:00:00.000Z (str)
    },

    {
      active: true, (bool)
      name: 'Payment 2 for User 2', (str)
      amount: 130, (int32)
      date: 2023-08-21T04:00:00.000Z, (str)
      user: 64e04af162bbc82763b078f9, (ObjectId)
      created: 2023-08-21T04:00:00.000Z, (str)
      updated: 2023-08-21T04:00:00.000Z (str)
    }
*/

const {
  pullFirstUser,
  pullPaymentsForUsers,
  convertToStr,
  getPaymentWithUser,
  getGroupedUserPmts,
} = require("./correct");

const { mongoose } = require("./models.js");

const FIRST_USER_ID = "64e04a7362bbc82763b078f4";
const SECOND_USER_ID = "64e04af162bbc82763b078f9";
const INVALID_USER_ID = "notRealUserId11111";

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function runTests() {
  try {
    // Test pullFirstUser function with 2 valid ObjectIds
    console.log("\nTesting pullFirstUser functionwith 2 valid ObjectIds:");
    const firstUser = await pullFirstUser([FIRST_USER_ID, SECOND_USER_ID]);
    console.log("Expected user ID:", convertToStr(FIRST_USER_ID));
    console.log(
        "Actual user ID:",
        firstUser ? convertToStr(firstUser._id) : "No user returned"
    );
    assert(
      firstUser && convertToStr(firstUser._id) === convertToStr(FIRST_USER_ID),
      "pullFirstUser function"
    );
    console.log("-------------------------");

    // Test pullFirstUser Function with 1 valid ObjectId
    console.log("\nTesting pullFirstUser function with 1 valid ObjectId: ")
    const invalidId = await pullFirstUser([INVALID_USER_ID, SECOND_USER_ID]);
    console.log("Expected user ID:", convertToStr(SECOND_USER_ID));
    console.log(
      "Actual user ID:",
      invalidId ? convertToStr(invalidId._id) : "No user returned"
    );
    assert(
      invalidId && convertToStr(invalidId._id) === convertToStr(SECOND_USER_ID),
      "pullFirstUser function skipped invalid ObjectId and returned first valid user"
    );
    console.log("-------------------------");

    // Test pullPaymentsForUsers function
    console.log("\nTesting pullPaymentsForUsers function:");
    const users = [{ _id: FIRST_USER_ID }, { _id: SECOND_USER_ID }];
    const payments = await pullPaymentsForUsers(users);
    console.log("Expected payments for users, got:", payments);
    assert(
      payments && payments.some((userPayments) => userPayments.length > 0),
      "pullPaymentsForUsers function returned expected results"
    );
    assert(
      payments && payments.length === users.length,
      "pullPaymentsForUsers function: Length matches"
    );
    const hasPayments = payments.some(
      (userPayments) => userPayments.length > 0
    );
    assert(hasPayments, "pullPaymentsForUsers function: Found payments for users");
    console.log("-------------------------");

    // Test convertToStr function
    console.log("\nTesting convertToStr function:");
    const objectId = new mongoose.Types.ObjectId();
    const objectIdToStr = convertToStr(objectId);
    console.log(`Expected: ${objectId.toHexString()}`);
    console.log(`Got: ${objectIdToStr}`);
    assert(
      objectIdToStr === objectId.toHexString(),
      "ObjectId converted to string successfully"
    );
    console.log("-------------------------");

    // Test getPaymentWithUser function
    console.log("\nTesting getPaymentWithUser function:");
    const paymentWithUser = await getPaymentWithUser("64e04aa062bbc82763b078f5");
    console.log(
      "Expected a payment with associated user, got:",
      paymentWithUser
    );
    assert(
      paymentWithUser && paymentWithUser.user,
      "getPaymentWithUser function returned associated user"
    );
    console.log("-------------------------");

    // Test getGroupedUserPmts function
    console.log("\nTesting getGroupedUserPmts function:");
    const groupedPayments = await getGroupedUserPmts([
      FIRST_USER_ID,
      SECOND_USER_ID,
    ]);
    console.log("Expected active payments grouped by user, got:", groupedPayments);
    assert(
      groupedPayments && Object.keys(groupedPayments).length > 0,
      "getGroupedUserPmts function returned grouped payments"
    );
    console.log("-------------------------");
  } catch (error) {
    console.error("Error running tests:", error);
  } finally {
    // Close the mongoose connection after tests have been completed
    mongoose.connection.close(() => {
      console.log("\nMongoose connection closed");
    });
  }
}

runTests();


