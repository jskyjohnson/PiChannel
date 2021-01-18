import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  RelationId,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Thread } from "./Thread";
import { User } from "./User";

@ObjectType({ description: "Object representing a Post" })
@Entity()
export class Post extends BaseEntity {
  //PostID
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  //UserID?
  // @Field((type) => User)
  // @ManyToOne((type) => User)
  // author: User;
  // @RelationId((author: User) => author.id)
  // authorId: number;

  //thread
  //Many to One?
  @Field()
  @Column()
  threadId: number;
  @ManyToOne((type) => Thread, (thread) => thread)
  @JoinColumn({ name: "threadId" })
  thread: Thread;

  //Date Posted/Created (Can't be updated)
  @Field()
  @CreateDateColumn()
  creation: Date;

  //Replies? array of Ids?
  //Future

  //Image? original
  //Future

  //Image? resized/thumbnail?...
  //Future

  //Content...
  @Field()
  @Column()
  text: string;
}
