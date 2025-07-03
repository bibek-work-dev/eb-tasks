import { GraphQLError } from "graphql";
import { TypeMyContext } from "../server";

const requireAuth = (context: TypeMyContext) => {
  // console.log("context in requireAuth", context.user);
  if (!context.user) {
    console.log("yeta aayo");
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
  return context.user;
};

export default requireAuth;
