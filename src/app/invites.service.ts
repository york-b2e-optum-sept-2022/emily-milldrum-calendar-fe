import { Injectable } from '@angular/core';
import {IInvite, IInvite2} from "./interfaces/IInvite";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
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

  onDestroy = new Subject();

  //error messages
  $inviteError = new BehaviorSubject<string | null>(null);
  private readonly INVITE_HTTP_ERROR = "There was an error with the HTTP server";



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

          // const getInvites = Object.values(inc).map(y => y.valueOf());
          // for (let i = 0; i < getInvites.length; i++){
          //   this.inviteList.push(getInvites[i]);
          // }
        }else {
          console.log('no invite list found')
        }

      },
      error: (err) => {
       this.$inviteError.next(this.INVITE_HTTP_ERROR);
       console.log(err)
      }
    })

    //this.inviteList = this.temp;
    this.$matchingInviteList.pipe(takeUntil(this.onDestroy)).subscribe(list => {
      if (list != null || undefined) {
        this.inviteList = null;
      } else{
        this.inviteList = list;
      }
    })
  }

  addInvite(account: IAccount) {
      //create invite list if no list exists
    if (this.newInviteList == null || undefined) {
      this.newInviteList = [{
          accountID: account.id,
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName
      }]

      this.eventService.setInviteList(this.newInviteList)
    } else {

      //if list exists, check for existing id in list
      const idFound = this.newInviteList.find(id => id.accountID === account.id);
      //modify existing list
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
    //find item
      const idFound = this.newInviteList.findIndex(id => id.accountID === account.id);
      this.newInviteList.splice(idFound, 1)
      this.eventService.setInviteList(this.newInviteList)
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
