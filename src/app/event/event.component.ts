import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../interfaces/IEvent";
import {EventService} from "../event.service";
import {Subject} from "rxjs";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {



  @Input() event!: IEvent;
  $selectedEvent!: IEvent;

  account: IAccount | null = null;
  onDestroy = new Subject();

  constructor(private eventService: EventService,
              private accountService: AccountService) {

    this.accountService.$account.subscribe(account => {
     this.account = account
   })

    //TODO unsub
  }


  ngOnInit(): void {
  }

  onUpdateClick(event: IEvent){
    //TODO
    console.log('update click works')
  }

  onDeleteClick(event: IEvent){
    console.log('delete click works')
    this.eventService.deleteEvent(event);
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  closeEvent(){
    console.log('close clicked')
    this.eventService.closeEvent();
  }



}
