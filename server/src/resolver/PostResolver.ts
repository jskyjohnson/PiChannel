import { Post } from "../entity/Post";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getManager } from "typeorm";
import { Thread } from "../entity/Thread";

@ObjectType()
class PostResponse {
  @Field()
  success: Boolean;

  @Field()
  message: String;

  @Field({ nullable: true })
  post: Post;
}

@InputType()
export class PostInput {
  @Field({ nullable: true }) //No idea how to handle this???
  threadId: number;

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
  @Mutation(() => PostResponse)
  async CreatePost(@Arg("content", (type) => PostInput!) content: PostInput) {
    const entityManager = getManager();
    const post = new Post();
    //check if threadID still exists...\
    const hasId = await entityManager.findOne(Thread, { id: content.threadId });
    if (!hasId) {
      console.log("Could not find thread with ID " + content.threadId);
      return {
        success: false,
        message: "Failed to find thread with ID " + content.threadId,
      };
    }

    try {
      post.threadId = content.threadId;
      post.text = content.text;
      await entityManager.save(post);
    } catch (err) {
      console.log("POST CREATION ERR " + err);
      return {
        success: false,
        message: "Failed to create post",
      };
    }

    return {
      success: true,
      message: "Successfully created post!",
      post: post,
    };
  }

  //ADMIN STUFF

  //Delete Post

  @Mutation(() => PostResponse)
  async DeletePost(@Arg("id") id: Number) {
    const entityManager = getManager();
    try {
      await entityManager.delete(Post, { id });
    } catch (err) {
      console.log("POST DELETION ERR " + err);
      return {
        success: false,
        message: "Failed to delete post " + id,
      };
    }

    return {
      success: false,
      message: "Deleted post " + id,
    };
  }
}
