const mongoCollections = require("./mongoCollection");
const blog = mongoCollections.blog;
const users = require("./users");
var objectID = require("mongodb").ObjectId;

async function getAllBlogPosts(skip = 0, take = 20) {
  // Validate skip
  if (isNaN(skip)) throw "Must enter a number for skip";
  if (typeof skip != "number") throw "Must enter a number for skip";
  if (skip < 0) throw "Value for skip is invalid";

  // Validate take
  if (isNaN(take)) throw "Must enter a number for take";
  if (typeof take != "number") throw "Must enter a number for take";
  if (take < 0) throw "Value for take is invalid";
  if (take > 100) {
    take = 100;
  }

  const blogCollection = await blog();

  let allBlogs = await blogCollection.find({}).skip(skip).limit(take).toArray();

  return allBlogs;
}

async function getPostbyId(id) {
  // Validate id
  if (typeof id != "string") throw "Must provide a string id";
  if (id.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(id);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  const blogCollection = await blog();

  let foundBlog = await blogCollection.findOne({ _id: newId });
  if (foundBlog == null) throw "No blog post with that id";

  return foundBlog;
}

async function updateTitle(id, title, userId) {
  // Validate id
  if (typeof id != "string") throw "Must provide a string id";
  if (id.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(id);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  // Validate title
  if (typeof title != "string") throw "Must provide a string title";
  if (title.trim().length == 0) throw "Title must not be only spaces";

  // Validate userid
  if (typeof userId != "string") throw "Must provide a string id";
  if (userId.trim().length == 0) throw "Id must not be only spaces";
  let newuserId = objectID(userId);
  if (!objectID.isValid(newuserId)) throw "Id must be valid";

  const blogCollection = await blog();

  try {
    let post = await getPostbyId(id);
    if (post.userThatPosted._id != userId)
      throw "Can not edit another user's post";
  } catch (e) {
    throw e;
  }
  let updatedBlogPost = await blogCollection.updateOne(
    { _id: newId },
    {
      $set: { title: title },
    }
  );
  return updatedBlogPost;
}

async function updateBody(id, body, userId) {
  // Validate id
  if (typeof id != "string") throw "Must provide a string id";
  if (id.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(id);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  // Validate body
  if (typeof body != "string") throw "Must provide a string body";
  if (body.trim().length == 0) throw "Body must not be only spaces";

  // Validate userid
  if (typeof userId != "string") throw "Must provide a string id";
  if (userId.trim().length == 0) throw "Id must not be only spaces";
  let newuserId = objectID(userId);
  if (!objectID.isValid(newuserId)) throw "Id must be valid";

  const blogCollection = await blog();

  try {
    let post = await getPostbyId(id);
    if (post.userThatPosted._id != userId)
      throw "Can not edit another user's post";
  } catch (e) {
    throw e;
  }
  let updatedBlogPost = await blogCollection.updateOne(
    { _id: newId },
    {
      $set: { body: body },
    }
  );
  return updatedBlogPost;
}

async function updateBlogPost(id, title, body, userId) {
  // Validate id
  if (typeof id != "string") throw "Must provide a string id";
  if (id.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(id);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  // Validate title
  if (typeof title != "string") throw "Must provide a string title";
  if (title.trim().length == 0) throw "Title must not be only spaces";

  // Validate body
  if (typeof body != "string") throw "Must provide a string body";
  if (body.trim().length == 0) throw "Body must not be only spaces";

  // Validate userid
  if (typeof userId != "string") throw "Must provide a string id";
  if (userId.trim().length == 0) throw "Id must not be only spaces";
  let newuserId = objectID(userId);
  if (!objectID.isValid(newuserId)) throw "Id must be valid";

  const blogCollection = await blog();

  try {
    let post = await getPostbyId(id);
    if (post.userThatPosted._id != userId)
      throw "Can not edit another user's post";
  } catch (e) {
    throw e;
  }
  let updatedBlogPost = await blogCollection.updateOne(
    { _id: newId },
    {
      $set: { title: title, body: body },
    }
  );
  post = await getPostbyId(id);
  return post;
}

async function createBlogPost(title, body, userThatPosted) {
  // Validate title
  if (typeof title != "string") throw "Must provide a string title";
  if (title.trim().length == 0) throw "Title must not be only spaces";

  // Validate body
  if (typeof body != "string") throw "Must provide a string body";
  if (body.trim().length == 0) throw "Body must not be only spaces";

  // Validate userThatPosted
  if (typeof userThatPosted != "string")
    throw "Must provide a string id for posting user";
  if (userThatPosted.trim().length == 0)
    throw "User posting id must not be only spaces";
  let newId = objectID(userThatPosted);
  if (!objectID.isValid(newId)) throw "User posting id must be valid";

  const blogCollection = await blog();
  let postingUser = null;
  try {
    postingUser = await users.getUserById(userThatPosted);
  } catch (e) {
    throw "No user found with posting id";
  }
  let newBlogPost = {
    title: title,
    body: body,
    userThatPosted: { _id: postingUser._id, username: postingUser.username },
    comments: [],
  };

  const insertedInfo = await blogCollection.insertOne(newBlogPost);

  if (insertedInfo.insertedCount === 0) throw "Could not add blog post";

  const insertedPost = await getPostbyId(String(insertedInfo.insertedId));
  return insertedPost;
}

async function addComment(id, userThatPostedComment, comment) {
  // Validate id
  if (typeof id != "string") throw "Must provide a string id";
  if (id.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(id);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  // Validate userThatPostedComment
  if (typeof userThatPostedComment != "string")
    throw "Must provide a string id for posting user";
  if (userThatPostedComment.trim().length == 0)
    throw "User posting id must not be only spaces";
  let newId2 = objectID(userThatPostedComment);
  if (!objectID.isValid(newId2)) throw "User posting id must be valid";

  // Validate Comment
  if (typeof comment != "string") throw "Must provide a string comment";
  if (comment.trim().length == 0) throw "Comment must not be only spaces";

  const blogCollection = await blog();
  const commentingUser = await users.getUserById(userThatPostedComment);

  let newComment = {
    _id: objectID(),
    userThatPostedComment: {
      _id: commentingUser._id,
      username: commentingUser.username,
    },
    comment: comment,
  };

  try {
    let updatedBlogPost = await blogCollection.updateOne(
      { _id: newId },
      {
        $push: { comments: newComment },
      }
    );
    return newComment;
  } catch (e) {
    throw e;
  }
}

async function deleteComment(blogId, commentId, userId) {
  // Validate blogId
  if (typeof blogId != "string") throw "Must provide a string id";
  if (blogId.trim().length == 0) throw "Id must not be only spaces";
  let newId = objectID(blogId);
  if (!objectID.isValid(newId)) throw "Id must be valid";

  // Validate commentId
  if (typeof commentId != "string") throw "Must provide a string id";
  if (commentId.trim().length == 0) throw "Id must not be only spaces";
  let newId2 = objectID(commentId);
  if (!objectID.isValid(newId2)) throw "Id must be valid";

  // Validate userid
  if (typeof userId != "string") throw "Must provide a string id";
  if (userId.trim().length == 0) throw "Id must not be only spaces";
  let newuserId = objectID(userId);
  if (!objectID.isValid(newuserId)) throw "Id must be valid";

  const blogCollection = await blog();
  let post = await getPostbyId(blogId);

  let deleteComment = null;
  for (let i of post.comments) {
    if (i._id == commentId) {
      deleteComment = i;
      if (i.userThatPostedComment._id != userId)
        throw "Can not delete a comment from another user";
    }
  }
  if (deleteComment == null) throw "Comment does not exist";

  let deleted = null;
  try {
    deleted = await blogCollection.updateOne(
      { _id: newId },
      {
        $pull: { comments: { _id: deleteComment._id } },
      }
    );
    post = await getPostbyId(blogId);
    return post;
  } catch (e) {
    throw "Could not delete post";
  }
}

module.exports = {
  getAllBlogPosts,
  getPostbyId,
  updateBlogPost,
  createBlogPost,
  addComment,
  deleteComment,
  updateBody,
  updateTitle,
};
