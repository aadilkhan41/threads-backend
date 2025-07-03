const zod = require("zod");

const signupObject = zod.object({
  name: zod.string(),
  username: zod.string().min(2),
  email: zod.string().email(),
  password: zod.string().min(6),
});

signupObject.required();

const loginObject = zod.object({
  username: zod.string().min(2),
  password: zod.string().min(6),
});

loginObject.required();

const createPostObject = zod.object({
  postedBy: zod.string(),
  text: zod.string().max(500),
});

createPostObject.required();

const updateProfileObject = zod.object({
  name: zod.string(),
  username: zod.string().min(2),
  email: zod.string().email(),
  password: zod.string().min(6).optional().or(zod.literal("")),
  bio: zod.string(),
  profilePic: zod.string()
});

module.exports = { loginObject, signupObject, createPostObject, updateProfileObject };
