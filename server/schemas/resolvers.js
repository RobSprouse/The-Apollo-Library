const { User } = require("../models/index");
const { signToken } = require("../utils/auth");

const resolvers = {
     Query: {
          me: async (_, _, context) => {
               if (context.user) {
                    const userData = await User.findOne({ _id: context.user._id })
                         .select("-__v -password")
                         .populate("savedBooks");
                    return userData;
               }
               throw new Error("Not logged in!");
          },
     },
     Mutation: {
          addUser: async (_, { username, email, password }) => {
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
          saveBook: async (_, { input }, context) => {
               try {
                    const updatedUser = await User.findOneAndUpdate(
                         { _id: context.user._id },
                         { $addToSet: { savedBooks: input } },
                         { new: true, runValidators: true }
                    );
                    return updatedUser;
               } catch (err) {
                    console.log(err);
                    throw new Error(err);
               }
          },
          removeBook: async (_, { bookId }, context) => {
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
