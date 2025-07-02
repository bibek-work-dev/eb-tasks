import { GraphQLError } from "graphql";
import { UserModel } from "../models/user.model";
import { ZodSchema } from "zod";
import { postDocument, PostModel } from "../models/post.model";
import { Types } from "mongoose";

const ensureUserExistAndReturnUserIfExists = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new GraphQLError("Author not Found");
  return user;
};

const ensurePostExistsAndReturnPostIfExists = async (postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) throw new GraphQLError("Post not found");
  return post;
};

const ensurePostOwnerShip = (userId: string, post: postDocument) => {
  console.log("post", post);
  const author = post.author;

  let authorId: string;

  if (author instanceof Types.ObjectId) {
    authorId = author.toString();
  } else if (author && typeof author === "object" && "_id" in author) {
    authorId = (author as { _id: Types.ObjectId })._id.toString();
  } else {
    throw new GraphQLError("Invalid post author data");
  }

  if (authorId !== userId) {
    throw new GraphQLError("You aren't the owner of the post", {
      extensions: { code: "FORBIDDEN" },
    });
  }
};

const validateInput = <T>(schema: ZodSchema<T>, input: unknown): T => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => e.message).join(",");
    throw new GraphQLError("Validation Error: " + message, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return parsed.data;
};

export {
  ensurePostOwnerShip,
  validateInput,
  ensureUserExistAndReturnUserIfExists,
  ensurePostExistsAndReturnPostIfExists,
};
