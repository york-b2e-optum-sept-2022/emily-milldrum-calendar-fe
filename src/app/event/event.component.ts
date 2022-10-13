import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../interfaces/IEvent";
import {EventService} from "../event.service";
import {first, Subject} from "rxjs";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event!: IEvent;

  account: IAccount | null = null;
  onDestroy = new Subject();

  constructor(private eventService: EventService,
              private accountService: AccountService) {

    this.accountService.$account.pipe(first()).subscribe(account => {
     this.account = account
   })
  }

  ngOnInit(): void {
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
