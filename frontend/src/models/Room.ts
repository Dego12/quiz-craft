import { RoomState } from "../resources/RoomState";
import { Guest } from "./Guest";
import { Quiz } from "./Quiz";

export interface Room {
  id: string;
  pin: number;
  state: RoomState;
  guests?: Array<Guest> | null;
  quiz: Quiz;
  hostConnectionId?: string;
  limitOfPlayers?: number;
}
