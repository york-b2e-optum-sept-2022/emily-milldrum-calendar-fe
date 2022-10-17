import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../event.service";
import {first, Subject, takeUntil} from "rxjs";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {IInvite} from "../interfaces/IInvite";
import {IEvent} from "../interfaces/IEvent";
import {InvitesService} from "../invites.service";


@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  @Input() account!: IAccount;
  @Input() event!: IEvent;

  private onDestroy = new Subject();
  private accountInc: IAccount | null = null;
  foundOnInvite: boolean = false;


  curAccID: string = "";
  private invitedList!:  IInvite;
  private eventInc!: IEvent;
  private isEditing: boolean = false;

  constructor(private eventService: EventService,
              private accountService: AccountService,
              private inviteService: InvitesService) {

    // this.accountService.$account.pipe(first()).subscribe(account => {
    //   this.account = account
    // })

    //get cur account & assign to id if not null
    this.accountService.$account
      .pipe(first())
      .subscribe(account => {
        this.accountInc = account
        if (this.accountInc == null){
            //TODO ERROR
        } else{
          this.curAccID = this.accountInc.id;
        }
      })

    //get the current invite list
    this.inviteService.$matchingInviteList
      .pipe(first())
      .subscribe(list => {

        if (list == null || undefined){
          //TODO ERROR
        } else{
          this.invitedList = list
        }
      })
    console.log(this.invitedList)

    this.eventService.$isEditing.pipe(takeUntil(this.onDestroy))
      .subscribe(isEditing => {this.isEditing = isEditing})
    //get add/remove bool
    this.eventService.$foundOnInvite.pipe(takeUntil(this.onDestroy)).
    subscribe(foundOnInvite => {this.foundOnInvite=foundOnInvite})

      // const existingAccount = this.newInviteList.find
      // (account => account.accountID === this.account.id);
      // if (existingAccount) {
      //   this.foundOnInvite = true;
      // } else {
      //   this.foundOnInvite= false;
      // }

    if (this.isEditing){
      console.log('invite editting')
      console.log(this.curAccID)
      console.log(this.invitedList)


      //TODO find existing invite
    // const existInvite = this.event.invited.find(
    //   person => person.invited.accountID == this.account.id)
    // {
    //   if (existInvite) {
    //     this.foundOnInvite = true;
    //   } else {
    //     this.foundOnInvite = false;
    //   }
    // }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  addInvite(account: IAccount){
    console.log(this.eventInc)
    console.log('add works')
    this.inviteService.addInvite(account)
    this.foundOnInvite = true;
  }

  removeInvite(account: IAccount){
    console.log('remove works')
    this.inviteService.removeInvite(account)
    this.foundOnInvite = false;
    //this.eventService.$foundOnInvite.next(false);
  }

}
