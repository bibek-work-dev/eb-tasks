import { GraphQLError, GraphQLResolveInfo } from "graphql";
import requireAuth from "../../middlewares/requireauth.middleware.js";
import { PostModel } from "../../models/post.model.js";
import { UserModel } from "../../models/user.model.js";
import {
  createPostSchema,
  deletePostSchema,
  TypeCreatePostSchema,
  TypeDeletePostSchema,
  TypeUpdatePostSchema,
  updatePostSchema,
} from "../../validations/post.validation.js";
import { TypeMyContext } from "../../server.js";
import {
  ensurePostExistsAndReturnPostIfExists,
  ensurePostOwnerShip,
  ensureUserExistAndReturnUserIfExists,
  validateInput,
} from "../../utils/helpers.js";

export const postResolvers = {
  Query: {
    posts: async () => PostModel.find(),
    post: async (parent: any, args: { id: string }) => {
      return await PostModel.findById(args.id);
    },
  },
  Mutation: {
    createPost: async (
      parent: unknown,
      args: { input: TypeCreatePostSchema },
      context: TypeMyContext,
      info: GraphQLResolveInfo
    ) => {
      const parsed = validateInput(createPostSchema, args.input);
      const user = requireAuth(context);
      await ensureUserExistAndReturnUserIfExists(user._id);
      const newPost = await PostModel.create({
        title: parsed.title,
        description: parsed.description,
        author: user._id,
      });
      return newPost;
    },

    updatePost: async (
      parent: unknown,
      args: { input: TypeUpdatePostSchema },
      context: TypeMyContext,
      info: GraphQLResolveInfo
    ) => {
      const parsed = validateInput(updatePostSchema, args.input);
      const user = requireAuth(context);
      await ensureUserExistAndReturnUserIfExists(user._id);

      const { id, description, title } = parsed;

      const toBeUpdatedPost = await ensurePostExistsAndReturnPostIfExists(id);

      await ensurePostOwnerShip(user._id, toBeUpdatedPost);

      if (title) toBeUpdatedPost.title = title;
      if (description) toBeUpdatedPost.description = description;
      return await toBeUpdatedPost.save();
    },
    deletePost: async (
      parent: unknown,
      args: { input: TypeDeletePostSchema },
      context: TypeMyContext,
      info: GraphQLResolveInfo
    ) => {
      const parsed = validateInput(deletePostSchema, args.input);
      const user = requireAuth(context);
      await ensureUserExistAndReturnUserIfExists(user._id);
      const toBeDeletedPost = await ensurePostExistsAndReturnPostIfExists(
        parsed.id
      );

      await ensurePostOwnerShip(user._id, toBeDeletedPost);

      await PostModel.findByIdAndDelete(toBeDeletedPost._id);
      return toBeDeletedPost;
    },
  },
  Post: {
    author: async (parent: any) => await UserModel.findById(parent.author),
  },
};
