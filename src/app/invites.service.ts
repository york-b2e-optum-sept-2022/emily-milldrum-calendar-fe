import { Injectable } from '@angular/core';
import {IInvite} from "./interfaces/IInvite";
import {BehaviorSubject, first, Subject} from "rxjs";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  $matchingInviteList = new Subject<IInvite>();
  inviteList!: IInvite;

  constructor(private httpService: HttpService) { }

  invitedList!:  IInvite;

  getInviteList(id: string){
     this.httpService.getInvites(id).pipe(first()).subscribe({
      next: incList => {
        this.inviteList = incList;
        this.$matchingInviteList.next(this.inviteList)
      },
      error: (err) => {
       //TODO this.$inviteError.next(this.EVENT_HTTP_ERROR);
        console.log(err)
      }
    })
  }

  addInvite(){

  }
  removeInvite(){

  }


}
