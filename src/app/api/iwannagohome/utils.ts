import { UserDB } from "@/app/auth/type";

export type IwannagohomeDB = {
  _id: string;
  owner: UserDB["id"];
  pick: string;
  date: string;
}