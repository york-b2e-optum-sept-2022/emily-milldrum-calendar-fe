import {IAccount} from "./IAccount";

export interface IEvent{
  id: string;
  creatorID: string;
  eventDate: Date;
  eventName: string;
  invited: {
    id: IAccount[]};
}
