import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { UserModel } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import { PostModel } from "../../models/post.model.js";
import { signJwt } from "../../utils/jwt.js";
import {
  deleteSchema,
  loginSchema,
  registerSchema,
  TypeDeleteInput,
  TypeLoginInput,
  TypeRegisterInput,
  TypeUpdateInput,
  updateSchema,
} from "../../validations/user.validation.js";
import requireAuth from "../../middlewares/requireauth.middleware.js";
import { TypeMyContext } from "../../server.js";
import {
  ensureUserExistAndReturnUserIfExists,
  validateInput,
} from "../../utils/helpers.js";

export const userResolvers = {
  Query: {
    users: async (parent: any, args: any, context: any, info: any) => {
      //   console.log("in users", parent, args, context, info);
      return await UserModel.find();
    },
    user: async (
      parent: any,
      args: { id: string },
      context: any,
      info: any
    ) => {
      //   console.log("parent:", parent);
      console.log("args:", args);
      console.log("context:", context);
      requireAuth(context);
      //   console.log("info:", info);
      return await UserModel.findById(args.id);
    },
  },
  Mutation: {
    register: async (
      parent: unknown,
      args: { input: TypeRegisterInput },
      context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const parsed = validateInput(registerSchema, args.input);
      const { name, email, password, role } = parsed;
      const existing = await UserModel.findOne({ email });
      if (existing)
        throw new GraphQLError("Email already registered", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        name,
        role,
        email,
        password: hashed,
      });
      return { message: "You are succesfully registered!!" };
    },
    login: async (
      parent: unknown,
      args: { input: TypeLoginInput },
      context: unknown,
      _info: GraphQLResolveInfo
    ) => {
      const parsed = validateInput(loginSchema, args.input);
      const { email, password } = parsed;
      const user = await UserModel.findOne({ email });
      if (!user)
        throw new GraphQLError("No such user found", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        throw new GraphQLError("Invalid password", {
          extensions: { code: "BAD_USER_INPUT" },
        });

      const token = signJwt({
        _id: user.id,
        role: user.role,
        email: user.email,
      });
      return { token, user };
    },
    updateUser: async (
      parent: unknown,
      args: { input: TypeUpdateInput },
      context: TypeMyContext,
      info: GraphQLResolveInfo
    ) => {
      const user = requireAuth(context);
      const parsed = validateInput(updateSchema, args.input);
      const { name, role } = parsed;
      const toBeUpdatedUser = await ensureUserExistAndReturnUserIfExists(
        user._id
      );
      if (name) toBeUpdatedUser.name = name;
      if (role) toBeUpdatedUser.role = role;
      return await toBeUpdatedUser.save();
    },
    deleteUser: async (
      parent: unknown,
      args: { input: TypeDeleteInput },
      context: TypeMyContext,
      info: GraphQLResolveInfo
    ) => {
      const user = requireAuth(context);
      const deletedUser = await UserModel.findByIdAndDelete(user._id);
      if (!deletedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return deletedUser;
    },
  },
  User: {
    posts: async (parent: any) => {
      return await PostModel.find({ author: parent._id });
    },
  },
};
