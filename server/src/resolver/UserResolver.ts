import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../entity/User";

// Provide resolver functions for your schema fields
@Resolver()
export class UserResolver {
  @Query(() => User)
  async GetUser(@Arg("id") id: Number) {
    let retUser = await User.findOne(+id);
    return retUser;
  }
  //I'll bother with this later...
  //?????????? 
}
