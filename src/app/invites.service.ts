import { Injectable } from '@angular/core';
import {IInvite} from "./interfaces/IInvite";
import {first, Subject, takeUntil} from "rxjs";
import {HttpService} from "./http.service";
import {EventService} from "./event.service";
import {IAccount} from "./interfaces/IAccount";
import {IEvent} from "./interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  $matchingInviteList = new Subject<IInvite>();
  invitedList:any [] = [];
  //creating a list
  $invitedList = new Subject<any>();
  //get invite
  inviteList:  IInvite | null = null;
  isEditing: boolean = false;
  onDestroy = new Subject();

  constructor(private httpService: HttpService,
              private eventService: EventService)
  {

    // this.eventService.$isEditing.pipe(takeUntil(this.onDestroy))
    //   .subscribe(isEditing => {this.isEditing = isEditing})
    }

  getInviteList(id: string){
     this.httpService.getInvites(id).pipe(first()).subscribe({
      next: incList => {
        if(incList){
        this.inviteList = incList;
        this.$matchingInviteList.next(this.inviteList)
        }else {
          console.log('no invite list found')
        }

      },
      error: (err) => {
       //TODO this.$inviteError.next(this.EVENT_HTTP_ERROR);
        console.log(err)
      }
    })
  }

  addInvite(account: IAccount, event: IEvent) {

    console.log('invite s add');

    // const newInvite = {
    //   accountID: account.id,
    //   email: account.email,
    //   firstName: account.firstName,
    //   lastName: account.lastName
    // }

    // console.log(newInvite);
    // if (!this.isEditing){
    //   console.log('not editing add');
    //   this.invitedList.push(newInvite)
    //   console.log(this.invitedList);
    //   this.$invitedList.next(this.invitedList);
     this.eventService.addInvite(account, event);
    // } else {

    // }
  }
  removeInvite(){
    // if (!this.isEditing){
      console.log('not editing remove');
      //this.invitedList.push(newInvite)
      console.log(this.invitedList);
    // } else {
      console.log(' editing remove, get http list');
    // }

  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
