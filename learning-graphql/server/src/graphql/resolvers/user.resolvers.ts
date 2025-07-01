import { GraphQLError } from "graphql";
import { UserModel } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import {
  CreateUserInput,
  DeleteUserInput,
  UpdateUserInput,
} from "../../types/user.types.js";
import { PostModel } from "../../models/post.model.js";
import { signJwt } from "../../utils/jwt.js";
import {
  DeleteInput,
  deleteSchema,
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
  UpdateInput,
  updateSchema,
} from "../../validations/user.validation.js";

type RegisterArgs = {
  input: RegisterInput;
};

type LoginArgs = {
  input: LoginInput;
};

type UpdateArgs = {
  input: UpdateInput;
};

type DeleteArgs = {
  input: DeleteInput;
};

type GetUser = {
  id: string;
};

export const userResolvers = {
  Query: {
    users: async (parent: any, args: any, context: any, info: any) => {
      //   console.log("in users", parent, args, context, info);
      return await UserModel.find();
    },
    user: async (parent: any, args: GetUser, context: any, info: any) => {
      //   console.log("parent:", parent);
      console.log("args:", args);
      console.log("context:", context);
      //   console.log("info:", info);
      return await UserModel.findById(args.id);
    },
  },
  Mutation: {
    register: async (
      parent: unknown,
      args: RegisterArgs,
      context: unknown,
      _info: unknown
    ) => {
      const parsed = registerSchema.safeParse(args.input);
      if (!parsed.success) {
        const message = parsed.error.errors.map((e) => e.message).join(", ");
        throw new GraphQLError("Validation Error: " + message);
      }
      const { name, email, password, role } = args.input;
      const existing = await UserModel.findOne({ email });
      if (existing)
        throw new GraphQLError("Email already registered", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ name, email, password: hashed });

      return { message: "You are succesfully registered!!" };
    },
    login: async (
      parent: unknown,
      args: LoginArgs,
      context: unknown,
      _info: unknown
    ) => {
      const parsed = loginSchema.safeParse(args.input);
      if (!parsed.success) {
        const message = parsed.error.errors.map((e) => e.message).join(", ");
        throw new GraphQLError("Validation Error: " + message);
      }
      const { email, password } = args.input;
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

      const token = signJwt({ _id: user.id, email: user.email });
      return { token, user };
    },
    updateUser: async (
      parent: unknown,
      args: UpdateArgs,
      context: unknown,
      info: unknown
    ) => {
      const parsed = updateSchema.safeParse(args.input);
      if (!parsed.success) {
        const message = parsed.error.errors.map((e) => e.message).join(", ");
        throw new GraphQLError("Validation Error: " + message);
      }
      const { id, name, role } = args.input;

      const toBeUpdatedUser = await UserModel.findById(id);
      if (!toBeUpdatedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (name) toBeUpdatedUser.name = name;
      if (role) toBeUpdatedUser.role = role;
      return await toBeUpdatedUser.save();
    },
    deleteUser: async (
      parent: unknown,
      args: DeleteArgs,
      context: unknown,
      info: unknown
    ) => {
      const parsed = deleteSchema.safeParse(args.input);
      if (!parsed.success) {
        const message = parsed.error.errors.map((e) => e.message).join(", ");
        throw new GraphQLError("Validation Error: " + message);
      }
      const { id } = args.input;
      console.log("input in deleteUser", args.input);
      const deletedUser = await UserModel.findByIdAndDelete(id);
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
