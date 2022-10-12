import {IInvite} from "./IInvite";

export interface IEvent{
  id: string;
  creatorID: string;
  eventDate: Date;
  eventName: string;
  invited: {
    id: IInvite[]};
}
