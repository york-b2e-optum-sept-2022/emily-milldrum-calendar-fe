import {Component, OnInit, SimpleChanges} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {NgForm} from "@angular/forms";
import {EventService} from "../event.service";
import {IEvent} from "../interfaces/IEvent";

@Component({
  selector: 'app-event-input',
  templateUrl: './event-input.component.html',
  styleUrls: ['./event-input.component.css']
})
export class EventInputComponent implements OnInit {
  accountList!: IAccount[];
  incList!: IAccount[];
  errorMessage: string | null = null;

  constructor(private accountService: AccountService, private eventService: EventService) {
    this.accountList = this.accountService.accountList;
    this.accountService.$accountList.subscribe((newList) => {
      this.incList = newList
      this.accountList = [...this.incList];})
  }

  ngOnInit(): void {
    //this.accountList = [...this.list];
  }
  //
  // ngOnChanges(changes: SimpleChanges){
  //   this.accountList = [...this.list];
  // }
  dateSelect: string = "";
  model: any;
  //dateConvert: string = "";

  invitedList!: IAccount[];

  account: IAccount | null = null;
  checkedStatus: boolean = false;
  dateConvert!: Date;

  options = [
    {name:'OptionA', value:'1', checked:true},
    {name:'OptionB', value:'2', checked:false},
    {name:'OptionC', value:'3', checked:true}
  ]


  onDateSelect(date: NgbDate){
    //return date.month
    console.log(date.day, date.month, date.year);
    // this.dateConvert = date.month.toString() + "/" +
    //   date.day.toString() + "/" + date.year.toString();
    this.dateConvert = new Date(date.year, date.month - 1, date.day)
    console.log(this.dateConvert)
  }

  eventCheck(event: any) {


    console.log(event.value);
    console.log(event.checkedStatus);
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
    if (event.checkedStatus == true) {
      this.invitedList.push(event.account)
    }else (event.checkedStatus)
    {
      console.log('to remove')
    }
    //this.invitedList.push(account);
   // console.log(this.invitedList)
  }

  createEvent(eventForm: NgForm){
    console.log('create event works')
    console.log(eventForm.value);

    this.eventService.createEvent(eventForm.value as IEvent, this.dateConvert, this.invitedList)
  }
  select(model: any){
    console.log(model);
  }


}
