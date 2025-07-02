import { GraphQLError } from "graphql";
import { TypeMyContext } from "../server";

const requireAuth = (context: TypeMyContext) => {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
  return context.user;
};

export default requireAuth;
