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

  onDestroy = new Subject();
  //account: IAccount | null = null;

  invitedList:  IInvite[] = [];
  private eventInc!: IEvent;
  constructor(private eventService: EventService,
              private accountService: AccountService,
              private inviteService: InvitesService) {

    // this.accountService.$account.pipe(first()).subscribe(account => {
    //   this.account = account
    // })

    //get cur account for disable
    // this.accountService.$account
    //   .pipe(takeUntil(this.onDestroy))
    //   .subscribe(account => {
    //     this.account = account
    //   })

  }

  ngOnInit(): void {
    console.log('invite log')
    console.log(this.account);
  }

  // onUpdateClick(event: IEvent){
  //   this.eventService.updateClick(event);
  // }
  //
  // onDeleteClick(event: IEvent){
  //   this.eventService.deleteEvent(event);
  // }
  //
  //
  // closeEvent(){
  //   this.eventService.closeEvent();
  // }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  addInvite(account: IAccount){
    console.log(this.eventInc)
    console.log('add works')
    this.inviteService.addInvite(account, this.eventInc)
  }

  removeInvite(account: IAccount){
    console.log('remove works')
    const newInvite: { } = {
      accountID: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName
    }
    this.inviteService.removeInvite()
  }

}
