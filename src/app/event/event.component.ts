import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../interfaces/IEvent";
import {EventService} from "../event.service";
import {first, Subject, takeUntil} from "rxjs";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {InvitesService} from "../invites.service";
import {IInvite} from "../interfaces/IInvite";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event!: IEvent;

  account: IAccount | null = null;
  onDestroy = new Subject();
  //TODO Fix
  inviteList: any;
  newInviteList!: IInvite;
  temp: IEvent[] = [];

  constructor(private eventService: EventService,
              private accountService: AccountService,
              private inviteService: InvitesService) {

    this.accountService.$account.pipe(first()).subscribe(account => {
     this.account = account;

   })
    // @ts-ignore
    this.inviteList = this.temp;
    this.inviteService.$matchingInviteList.pipe(takeUntil(this.onDestroy)).subscribe(list => {
      this.inviteList = list;
    })

  }

  ngOnInit(): void {
    this.inviteService.getInviteList(this.event.id)
  }

  onUpdateClick(event: IEvent){

    this.eventService.updateClick(event);
  }


  onDeleteClick(event: IEvent){
    this.eventService.deleteEvent(event);
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  closeEvent(){
    this.eventService.closeEvent();
  }
}
