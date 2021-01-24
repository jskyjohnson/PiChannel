import { Board } from "../entity/Board";
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

// Provide resolver functions for your schema fields
// Response
@ObjectType()
class BoardResponse {
  @Field()
  success: Boolean;

  @Field()
  message: String;

  @Field()
  board: Board;
}

@ObjectType()
class CollectionsResponse {
  @Field()
  collection: String;
}

@InputType()
class BoardInput {
  @Field()
  name: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  categories: [string];

  @Field({ nullable: true })
  collection: string;

  @Field()
  limit: number;
}

@InputType()
class BoardUpdate {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => [String], { nullable: true })
  categories: [string];

  @Field({ nullable: true })
  collection: string;

  @Field({ nullable: true })
  limit: number;
}

@Resolver()
export class BoardResolver {
  @Query(() => Board)
  async GetBoard(@Arg("name") name: String) {
    let retBoard = await Board.findOne({ where: { name: name } });
    return retBoard;
  }

  @Query(() => [Board])
  async GetBoards() {
    let retBoard = await Board.find();
    return retBoard;
  }

  //Get Collections?
  @Query(() => [CollectionsResponse])
  async GetCollections() {
    const entityManager = getManager();
    const retCollection = await entityManager
      .createQueryBuilder()
      .select("collection")
      .from(Board, "board")
      .distinct()
      .getRawMany();
    return retCollection;
  }

  //Get All Boards?

  //Admin Stuff
  //Create Board
  @Mutation(() => BoardResponse)
  async CreateBoard(
    @Arg("content", (type) => BoardInput!) content: BoardInput
  ) {
    const entityManager = getManager();
    const board = await entityManager.findOne(Board, { name: content.name });
    if (!board) {
      try {
        const board_t = {
          name: content.name,
          title: content.title,
          description: content.description,
          categories: content.categories,
          collection: content.collection,
          limit: content.limit,
        };

        await entityManager.insert(Board, board_t);
      } catch (err) {
        console.log(" BOARD CREATION ERR" + err);
        return {
          success: false,
          message: "Failed to create new board",
          board: board,
        };
      }
    } else {
      //Board with name already exists!
      return {
        success: false,
        message: "Board with name " + content.name + " already exists!",
        board: board,
      };
    }

    return {
      success: true,
      message: "Created new board " + content.name,
      board: board,
    };
  }

  //Update Board
  @Mutation(() => BoardResponse)
  async UpdateBoard(
    @Arg("name", () => String!) name: string,
    @Arg("content", (type) => BoardUpdate!) content: BoardUpdate
  ) {
    const entityManager = getManager();
    const board = await entityManager.findOne(Board, { name: name });
    if (board != undefined) {
      try {
        //Updating board...
        content.title ? (board!.title = content.title) : null;
        content.description ? (board!.description = content.description) : null;
        content.categories ? (board!.categories = content.categories) : null;
        content.collection ? (board!.collection = content.collection) : null;
        content.limit ? (board!.limit = content.limit) : null;
        await entityManager.save(Board, board);
      } catch (err) {
        console.log(" BOARD UPDATE ERR" + err);
        return {
          success: false,
          message: "Failed to update board" + board!.name,
          board: board,
        };
      }
    } else {
      //Board with name already exists!
      return {
        success: false,
        message: "Could not find board with name " + name,
        board: board,
      };
    }

    return {
      success: true,
      message: "Updated board " + name,
      board: board,
    };
  }

  //Delete Board??
  @Mutation(() => BoardResponse)
  async DeleteBoard(@Arg("name", () => String) name: string) {
    const entityManager = getManager();
    const board = await entityManager.findOne(Board, { name: name });
    try {
      await entityManager.delete(Board, board);
    } catch (err) {
      return {
        success: false,
        message: "Failed to deleted board " + name,
        board: null,
      };
    }

    return {
      success: true,
      message: "Deleted board " + name,
      board: null,
    };
  }
}
