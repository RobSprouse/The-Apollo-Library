// COMMENT: imports the User model and the signToken function from the utils folder
const { User } = require("../models/index");
const { signToken, AuthenticationError } = require("../utils/auth");

// COMMENT: defines the resolvers
const resolvers = {
     // COMMENT: defines the Query resolvers
     Query: {
          // COMMENT: defines the me resolver
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
     // COMMENT: defines the Mutation resolvers
     Mutation: {
          // COMMENT: defines the addUser resolver
          addUser: async (parent, { username, email, password }) => {
               const user = await User.create({ username, email, password });
               const token = signToken(user);
               return { token, user };
          },
          // COMMENT: defines the login resolver
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
          // COMMENT: defines the saveBook resolver
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
          // COMMENT: defines the removeBook resolver
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

// COMMENT: exports the resolvers
module.exports = resolvers;
