import { PostModel } from "../../models/post.model";
import { UserModel } from "../../models/user.model";

export const postResolvers = {
  Query: {
    posts: async () => PostModel.find(),
    post: async (_: any, { id }: { id: string }) => {
      await PostModel.findById(id);
    },
  },
  Mutation: {
    createPost: async (
      _: any,
      { input }: { input: { title: string; content: string; authorId: string } }
    ) => {
      const user = await UserModel.findById(input.authorId);
      if (!user) {
        throw new Error("Author not found");
      }
      const newPost = await PostModel.create({
        title: input.title,
        content: input.content,
        author: input.authorId,
      });

      return newPost;
    },
    Post: {
      author: async (parent: any) => await UserModel.findById(parent.author),
    },
  },
};
