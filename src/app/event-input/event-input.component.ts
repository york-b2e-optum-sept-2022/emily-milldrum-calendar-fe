import {Component, Input, OnInit} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {NgForm} from "@angular/forms";
import {EventService} from "../event.service";
import {IEvent} from "../interfaces/IEvent";
import {first, Subject, takeUntil} from "rxjs";
import {IInvite} from "../interfaces/IInvite";

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
    id: "",
    invited: {id: []
    }

  }
  //event!: IEvent;

  //from app/list
  @Input() event!: IEvent;

  isEditing: boolean = true;

  model: any;
  onDestroy = new Subject();
  errorMessage: string | null = null;
  dateSelect: string = "";
  dateConvert!: Date;
  isChecked!: boolean;

  inviteStatus: boolean = false;
  inviteString: string = "Invite";
  cancelInviteButton: string = "Cancel Invite";


  constructor(private accountService: AccountService,
              private eventService: EventService) {
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
        console.log(selectEvent.id)
        console.log(selectEvent.eventName)
      } else{
        console.log('error event input')
      }
      console.log('current event in event input')
      console.log(this.eventInc)

    })

    //subscribe to editing change
    this.eventService.$isEditing.pipe(takeUntil(this.onDestroy))
      .subscribe(isEditing => {this.isEditing = isEditing})
  }

  //TODO code clean up
  ngOnInit(): void {
    //this.accountList = [...this.list];
  }
  //
  // ngOnChanges(changes: SimpleChanges){
  //   this.accountList = [...this.list];
  // }

  getEventName(){
    if (this.eventInc.eventName == undefined){
      return "";
    } else
    return this.eventInc?.eventName
  }
  onDateSelect(date: NgbDate){
    //convert date data to Date format
    this.dateConvert = new Date(date.year, date.month - 1, date.day)
  }
  //
  // eventCheck(event: any, account: IAccount, isChecked: boolean) {
  //
  //   console.log(isChecked)
  //   console.log(this.isChecked)
  //   console.log(account)
  //
  //   if (event) {
  //     const invited: IInvite =   {
  //       id: "",
  //       email: "",
  //       firstName: "",
  //       lastName: "",
  //     }
  //     this.invitedList.push(invited)
  //   }else (!event)
  //   {
  //     console.log('to remove')
  //   }
  //   //this.invitedList.push(account);
  // }

  // invite(account: IAccount){
  //
  //   const newInvite: IInvite = {
  //     id: account.id,
  //     email: account.email,
  //     firstName: account.firstName,
  //     lastName: account.lastName
  //   }
  //   console.log(newInvite);
  //   //this.invitedList.push(newInvite)
  //   console.log(this.invitedList);
  //
  // }

  createEvent(eventForm: NgForm){
    this.eventService.createEvent(
      eventForm.value as IEvent,
      this.dateConvert,
      this.invitedList)
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
