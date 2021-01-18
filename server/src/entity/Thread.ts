import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  RelationId,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Board } from "./Board";
import { Post } from "./Post";

@ObjectType({ description: "Object representing a Thread" })
@Entity()
export class Thread extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  //Board
  //Many to One?
  @Field()
  @Column()
  boardId: number;
  @ManyToOne((type) => Board, (board) => board)
  @JoinColumn({ name: "boardId" })
  board: Board;

  //Title
  @Field({ nullable: true })
  @Column("text", { nullable: true })
  title: string;

  //Category
  //Categories only from parent board?
  @Field({ nullable: true })
  @Column({ nullable: true })
  category: string;

  //Date Created
  @Field()
  @CreateDateColumn()
  creation: Date;

  //Posts
  //One to Many posts?
  @Field((type) => [Post])
  @OneToMany((type) => Post, (post) => post.thread, {
    cascade: ["insert"],
  })
  posts: Post[];

  //Initial Post
  //One post object?
  @Field()
  @Column({ nullable: true })
  initialPostId: number;
}
