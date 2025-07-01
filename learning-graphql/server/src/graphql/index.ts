// import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
// import { userTypeDefs } from "./schema/user.typeDefs.js";
// import { userResolvers } from "./resolvers/user.resolvers.js";

// export const typeDefs = mergeTypeDefs([userTypeDefs]);
// export const resolvers = mergeResolvers([userResolvers]);

import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from "./schema/user.typeDefs.js";
import { userResolvers } from "./resolvers/user.resolvers.js";
import { postTypeDefs } from "./schema/post.typeDefs.js";
import { postResolvers } from "./resolvers/post.resolver.js";

export const typeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs]);
export const resolvers = mergeResolvers([userResolvers, postResolvers]);
