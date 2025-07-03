import gql from "graphql-tag";

export const postTypeDefs = gql`
  input CreatePostInput {
    title: String!
    description: String!
  }

  input UpdatePostInput {
    id: ID!
    title: String
    description: String
  }

  input DeletePostInput {
    id: ID!
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    author: User!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  extend type Mutation {
    createPost(input: CreatePostInput): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(input: DeletePostInput!): Post!
  }
`;
