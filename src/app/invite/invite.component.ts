import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../event.service";
import {Subject} from "rxjs";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {IInvite} from "../interfaces/IInvite";


@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  @Input() account!: IAccount;

  onDestroy = new Subject();
  invitedList:  IInvite[] = [];
  constructor(private eventService: EventService,
              private accountService: AccountService) {

    // this.accountService.$account.pipe(first()).subscribe(account => {
    //   this.account = account
    // })
  }

  ngOnInit(): void {
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
    // const newInvite: IInvite = {
    //   id: event.id,
    //   email: account.email,
    //   firstName: account.firstName,
    //   lastName: account.lastName
    // }
    // console.log(newInvite);
    // this.invitedList.push(newInvite)
    // console.log(this.invitedList);

  }

}
