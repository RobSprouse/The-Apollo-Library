const { User } = require("../models/index");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
     Query: {
          me: async (_, args, context) => {
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
          addUser: async (parent, { username, email, password }) => {
               const user = await User.create({ username, email, password });
               const token = signToken(user);
               return { token, user };
          },
          login: async (parent, { email, password }) => {
               const user = await User.findOne({ email });

               if (!user) {
                    throw AuthenticationError;
               }

               const correctPw = await user.isCorrectPassword(password);

               if (!correctPw) {
                    throw AuthenticationError;
               }

               const token = signToken(user);

               return { token, user };
          },
          saveBook: async (_, { bookData }, context) => {
               try {
                    if (!context.user) {
                         throw new Error("Not authenticated");
                    }
                    const updatedUser = await User.findOneAndUpdate(
                         { _id: context.user._id },
                         { $addToSet: { savedBooks: bookData } },
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

module.exports = resolvers;
