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
  eventInc!: IEvent | null;
  @Input() event!: IEvent;

  checkedStatus: boolean = false;
  isEditing: boolean = true;

  model: any;
  onDestroy = new Subject();
  errorMessage: string | null = null;
  dateSelect: string = "";
  dateConvert!: Date;

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

      this.eventInc = selectEvent
      console.log('current event in event input')
      console.log(this.eventInc)
      console.log(this.eventInc?.id)
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

  onDateSelect(date: NgbDate){
    //convert date data to Date format
    this.dateConvert = new Date(date.year, date.month - 1, date.day)
  }


  //TODO invite select & create invite [] format
  options = [
    {name:'OptionA', value:'1', checked:true},
    {name:'OptionB', value:'2', checked:false},
    {name:'OptionC', value:'3', checked:true}
  ]

  eventCheck(event: any) {
    if (event.checkedStatus) {
      const invited =   {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
      }
      this.invitedList.push(invited)
    }else (!event.checkedStatus)
    {
      console.log('to remove')
    }
    //this.invitedList.push(account);
    console.log(this.invitedList)
    console.log(this.account?.firstName);
    console.log(event.value);
    console.log(event.checkedStatus);
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  createEvent(eventForm: NgForm){
    this.eventService.createEvent(
      eventForm.value as IEvent,
      this.dateConvert,
      this.invitedList)
  }

  updateEvent(eventForm: NgForm){
    this.eventService.updateEvent(
      eventForm.value as IEvent,
      this.dateConvert,
      this.invitedList);
  }

  cancelUpdate(){
    this.eventService.$isEditing.next(false);
  }

  //for date select
  select(model: any){
    console.log(model);
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
