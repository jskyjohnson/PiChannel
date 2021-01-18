import { Post } from "../entity/Post";
import { Arg, Field, InputType, Query, Resolver } from "type-graphql";

@InputType()
export class PostInput {

  //@Field() //No idea how to handle this???
  //threadId: number;

  @Field() //Not nullable...?
  text: string;
}

// Provide resolver functions for your schema fields
@Resolver()
export class PostResolver {
  @Query(() => Post)
  async GetPost(@Arg("id") id: Number) {
    let retPost = await Post.findOne(+id);
    return retPost;
  }

  //Get a post?
  //Get all posts in a thread

  //Create Post

  //ADMIN STUFF

  //Delete Post
}
