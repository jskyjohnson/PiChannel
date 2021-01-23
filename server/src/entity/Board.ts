import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  RelationId,
} from "typeorm";
import { threadId } from "worker_threads";
import { Thread } from "./Thread";

@ObjectType({ description: "Object representing a board" })
@Entity()
export class Board extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  //Board name '/a'
  @Field()
  @Column()
  name: string;

  //Board title 'anime'
  @Field()
  @Column()
  title: string;

  //Board Description 'for anime related things'
  @Field()
  @Column("text")
  description: string;

  //board categories
  //Array of category strings this board has 'images, discussion, memes' etc
  @Field((type) => [String], { nullable: true })
  @Column("text", { nullable: true, array: true })
  categories: [string];

  //Board collection
  //Where this board belongs, e.g. 'nsfw, anime, other stuff... idk?>' probably not needed
  @Field()
  @Column()
  collection: string;

  //Thread limit
  //Number of threads before deleting the last one
  @Field()
  @Column()
  limit: number;

  //Threads
  //Array of current threads?
  //One to Many?
  @Field((type) => [Thread], { nullable: true })
  @OneToMany((type) => Thread, (thread) => thread.board)
  threads: Thread[];

  //Do I need a typeorm thing for this? I honestly have no idea...
}
