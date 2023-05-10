const mongoCollections = require("./mongoCollection");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const saltRounds = 16;
var objectID = require("mongodb").ObjectId;

async function getUserById(id) {
  // Validate id
  if (typeof id != "string") throw "Must provide a string id";
  if (id.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(id);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  const userCollection = await users();

  let foundUser = await userCollection.findOne({ _id: newId });

  if (foundUser == null) throw "No user with this id found";

  return foundUser;
}

async function createUser(name, username, password) {
  // Validate name
  if (typeof name != "string") throw "Must provide a string name";
  if (name.trim().length == 0) throw "Name must not be only spaces";

  // Validate username
  if (typeof username != "string") throw "Must provide a string username";
  if (username.trim().length == 0) throw "Username must not be only spaces";

  // Validate password
  if (typeof password != "string") throw "Must provide a string username";
  if (password.trim().length == 0) throw "Password must not be only spaces";

  const userCollection = await users();
  const hashpass = await bcrypt.hash(password, saltRounds);
  username = username.toLowerCase();

  const noUser = await userCollection.findOne({ username: username });
  if (noUser != null) {
    throw "Username already taken";
  }

  let newUser = {
    name: name,
    username: username,
    password: hashpass,
  };

  const insertedInfo = await userCollection.insertOne(newUser);
  if (insertedInfo.insertedCount === 0) throw "Could not add new user";

  let insertedUser = await getUserById(String(insertedInfo.insertedId));

  let returnUser = {
    _id: insertedUser._id,
    name: insertedUser.name,
    username: insertedUser.username,
  };

  return returnUser;
}

async function login(username, password) {
  // Validate username
  if (typeof username != "string") throw "Must provide a string username";
  if (username.trim().length == 0) throw "Username must not be only spaces";
  username = username.toLowerCase();

  // Validate password
  if (typeof password != "string") throw "Must provide a string username";
  if (password.trim().length == 0) throw "Password must not be only spaces";

  const userCollection = await users();

  let foundUser = await userCollection.findOne({ username: username });

  if (foundUser == null) throw "Username or password is incorrect";

  let match = false;
  try {
    match = await bcrypt.compare(password, foundUser.password);
  } catch (e) {
    throw "Error with password";
  }

  if (match) {
    return {
      _id: foundUser._id,
      name: foundUser.name,
      username: foundUser.username,
    };
  } else {
    throw "Username or password is incorrect";
  }
}

module.exports = {
  getUserById,
  createUser,
  login,
};
