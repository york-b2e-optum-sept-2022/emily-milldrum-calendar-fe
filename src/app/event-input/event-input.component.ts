import {Component, Input, OnInit} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {NgForm} from "@angular/forms";
import {EventService} from "../event.service";
import {IEvent} from "../interfaces/IEvent";
import {first, Subject, takeUntil} from "rxjs";
import {IInvite} from "../interfaces/IInvite";
import {InvitesService} from "../invites.service";

@Component({
  selector: 'app-event-input',
  templateUrl: './event-input.component.html',
  styleUrls: ['./event-input.component.css']
})
export class EventInputComponent implements OnInit {
  //variables
  accountList!: IAccount[];
  incList!: IAccount[];
  invitedList!: IInvite[];
  account: IAccount | null = null;
  eventInc: IEvent = {
    creatorID: "",
    eventDate: new Date(),
    eventName: "",
    id: ""

  }
  //from app/list
  @Input() event!: IEvent;

  isEditing: boolean = true;

  model: any;
  onDestroy = new Subject();
  errorMessage: string | null = null;
  dateSelect: string = "";
  dateConvert!: Date;

  //TODO fix type
  newInviteList: any;




constructor(private accountService: AccountService,
              private eventService: EventService,
            private inviteService: InvitesService) {

    //get account list and make a copy for invites
    this.accountList = this.accountService.accountList;
    this.accountService.$accountList.pipe(takeUntil(this.onDestroy))
      .subscribe((newList) => {
      this.incList = newList
      this.accountList = [...this.incList];})

    //get selected account data to fill fields
    this.eventService.$selectedEvent.pipe(first()).subscribe(selectEvent => {

      if (selectEvent != null){
        this.eventInc = selectEvent
      } else{
        console.log('error event input')
      }
    })

    //subscribe to editing change
    this.eventService.$isEditing.pipe(takeUntil(this.onDestroy))
      .subscribe(isEditing => {this.isEditing = isEditing})

  this.inviteService.$invitedList.pipe(takeUntil(this.onDestroy)).subscribe(list => {
    this.newInviteList = list;
  })

}

  ngOnInit(): void {

  }

  onDateSelect(date: NgbDate){
    //convert date data to Date format
    this.dateConvert = new Date(date.year, date.month - 1, date.day)
  }


  createEvent(eventForm: NgForm){
    this.eventService.createEvent(
      eventForm.value as IEvent,
      this.dateConvert)
  }

  updateEvent(eventForm: NgForm){
    const updateEvent = {
      id: this.eventInc?.id,
      creatorID: this.event.creatorID,
      eventDate: this.dateConvert,
      eventName: this.eventInc.eventName,
      invited: {
        id: []}
    }
    this.eventService.updateEvent(updateEvent);
    this.eventService.$isEditing.next(false)
    this.eventService.$selectedEvent.next(null)
    // this.eventService.updateEvent(
    //   eventForm.value as IEvent,
    //   this.dateConvert,
    //   this.invitedList);
  }

  cancelUpdate(){
    this.eventService.$isEditing.next(false);
  }

  //for date select
  select(model: any){
    console.log(model + "test");
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
