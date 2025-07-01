import gql from "graphql-tag";

export const postTypeDefs = gql`
  type Post {
    id: Id!
    title: String!
    content: String!
    author: User!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  extend type Mutation {
    createPost(input: CreatePostInput): Post!
  }
`;
