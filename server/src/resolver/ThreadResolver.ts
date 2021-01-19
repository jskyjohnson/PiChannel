import { Thread } from "../entity/Thread";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Post } from "../entity/Post";
import { Board } from "../entity/Board";
import { PostInput } from "./PostResolver";
import { getManager } from "typeorm";

// Provide resolver functions for your schema fields
@ObjectType()
class ThreadResponse {
  @Field()
  success: Boolean;

  @Field()
  message: String;

  @Field({ nullable: true })
  url: String;

  @Field({ nullable: true })
  thread: Thread;

  @Field({ nullable: true })
  initialPost: Post;

  @Field((type) => [Post], { nullable: true })
  posts: [Post];
}

@InputType()
class ThreadInput {
  @Field()
  boardName: string;

  @Field()
  title: string;

  @Field()
  category: string;

  @Field()
  initialPost: PostInput;
}

@Resolver()
export class ThreadResolver {
  //Get a specific query...
  @Query(() => Thread)
  async GetThread(@Arg("id") id: Number) {
    let retThread = await Thread.findOne(+id);
    retThread!.posts = await Post.find({ where: { threadId: id } });
    return retThread;
  }

  //Create Thread
  //Creating a thread will always create an initial post?
  @Mutation(() => ThreadResponse)
  async CreateThread(
    @Arg("content", (type) => ThreadInput!) content: ThreadInput
  ) {
    //Create new thread...
    const entityManager = getManager();
    const board = await entityManager.findOne(Board, {
      name: content.boardName,
    });
    const boardId = board?.id;

    if (boardId == undefined) {
      return {
        success: false,
        message: "Failed to to find board with name " + content.boardName,
      };
    }
    const thread = new Thread();
    const post = new Post();

    try {
      thread.boardId = boardId;
      thread.title = content.title;
      thread.category = content.category;

      post.text = content.initialPost.text;
      post.threadId = thread.id;
      thread.initialPostId = post.id;

      const threadId = (await entityManager.save(thread))?.id!;
      post.threadId = threadId;
      const postId = (await entityManager.save(post))?.id;

      const t_thread = await entityManager.update(Thread, post.threadId, {
        initialPostId: postId,
      });

      //Need to update the board to delete the oldest thread now...
      const numberOfThreads = await entityManager.count(Thread, {
        boardId: boardId,
      });

      if (numberOfThreads > board!.limit) {
        //DELETE THREAD
        const oldestThread = await entityManager.findOne(Thread, {
          where: { boardId: boardId },
          order: {
            creation: "ASC",
          },
        });
        await entityManager.delete(Post, { threadId: oldestThread?.id });
        await entityManager.delete(Thread, oldestThread?.id);
      }
    } catch (err) {
      console.log("THREAD CREATION ERR " + err);
      return {
        success: false,
        message: "Failed to create thread ",
      };
    }

    return {
      success: true,
      message: "Successfully Created New Thread ",
      url: null,
      thread: thread,
      initialPost: post,
    };
  }

  //Admin:
  //Delete Thread

  @Mutation(() => ThreadResponse)
  async DeleteThread(@Arg("id") id: Number) {
    const entityManager = getManager();
    try {
      await entityManager.delete(Post, { threadId: id });
      await entityManager.delete(Thread, id);
    } catch (err) {
      console.log("THREAD DELETION ERR " + err);
      return {
        success: false,
        message: "Failed to delete thread " + id,
      };
    }

    return {
      success: false,
      message: "Deleted thread " + id,
    };
  }
}
