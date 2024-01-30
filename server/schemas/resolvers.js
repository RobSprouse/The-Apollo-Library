const { User } = require("../models/index");
const { signToken } = require("../utils/auth");

const resolvers = {
     Query: {
          getSingleUser: async (parent, { _id, username }, context) => {
               const user = context.user;
               const foundUser = await User.findOne({
                    $or: [{ _id: user ? user._id : _id }, { username: username }],
               });
               if (!foundUser) {
                    throw new Error("Cannot find a user with this id!");
               }
               return foundUser;
          },
     },
     Mutation: {
          createUser: async (_, { username, email, password }) => {
               const user = await User.create({ username, email, password });
               if (!user) {
                    throw new Error("A problem occurred while creating the user.");
               }
               const token = signToken(user);
               return { token, user };
          },
          login: async (_, { username, email, password }) => {
               const user = await User.findOne({ $or: [{ username }, { email }] });
               if (!user) {
                    throw new Error("A user with this username or email was not found.");
               }
               const correctPw = await user.isCorrectPassword(password);
               if (!correctPw) {
                    throw new Error("The password provided is incorrect.");
               }
               const token = signToken(user);
               return { token, user };
          },
          saveBook: async (_, { authors, description, bookId, image, link, title }, context) => {
               try {
                    const book = { authors, description, bookId, image, link, title };
                    const updatedUser = await User.findOneAndUpdate(
                         { _id: context.user._id },
                         { $addToSet: { savedBooks: book } },
                         { new: true, runValidators: true }
                    );
                    return updatedUser;
               } catch (err) {
                    console.log(err);
                    throw new Error(err);
               }
          },
          deleteBook: async (_, { bookId }, context) => {
               const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
               );
               if (!updatedUser) {
                    throw new Error("Couldn't find user with this id!");
               }
               return updatedUser;
          },
     },
};
