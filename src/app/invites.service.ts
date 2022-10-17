import { Injectable } from '@angular/core';
import {IInvite, IInvite2} from "./interfaces/IInvite";
import {first, Subject, takeUntil} from "rxjs";
import {HttpService} from "./http.service";
import {EventService} from "./event.service";
import {IAccount} from "./interfaces/IAccount";

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  $matchingInviteList = new Subject<IInvite>();
  invitedList:any [] = [];

  //TODO Fix
  //inviteList: any;
  newInviteList!: IInvite2[];

  //creating a list
  $invitedList = new Subject<any>();
  //get invite
  inviteList:  IInvite | null = null;

  isEditing: boolean = false;
  foundOnInvite: boolean = false;
  onDestroy = new Subject();

  constructor(private httpService: HttpService,
              private eventService: EventService)
  {

    // this.eventService.$isEditing.pipe(takeUntil(this.onDestroy))
    //   .subscribe(isEditing => {this.isEditing = isEditing})
    }
    //get list from http
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
    //this.inviteList = this.temp;
    this.$matchingInviteList.pipe(takeUntil(this.onDestroy)).subscribe(list => {
      if (list != null || undefined) {
        this.inviteList = null;
        console.log('invite list is not found')
      } else{
        this.inviteList = list;
        console.log('invite list found')

        console.log(list)
      }
    })
  }

  addInvite(account: IAccount) {

      console.log('invite s add');
      //create invite list if no list exists
    if (this.newInviteList == null || undefined) {
      console.log('invite list doesnt exist, creating new');
      this.newInviteList = [{
          accountID: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName
      }]
      console.log(this.newInviteList)

      this.eventService.setInviteList(this.newInviteList)
    } else {

      //if list exists, check for existing id in list
      const idFound = this.newInviteList.find(id => id.accountID === account.id);
      //modify existing list
      console.log('invite list exists, modify exist')

      //if found
      if (idFound){

        console.log('account id found in list')

        //if not found
      } else {

        const newInvite: IInvite2 = {
          accountID: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName
        }
        this.newInviteList.push(newInvite);
        this.eventService.setInviteList(this.newInviteList)
        console.log(this.newInviteList)
      }
    }
  }

  removeInvite(account: IAccount){

    //if list exists...

    //find item
      const idFound = this.newInviteList.findIndex(id => id.accountID === account.id);
      this.newInviteList.splice(idFound, 1)
      console.log(' editing remove, get http list');
    // }

  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
