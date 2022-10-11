import {Component, OnInit, SimpleChanges} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {NgForm} from "@angular/forms";
import {formatDate} from "@angular/common";
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
  dateConvert: string = "";


  onDateSelect(date: NgbDate){
    //return date.month
    console.log(date.day, date.month, date.year);
    this.dateConvert = date.month.toString() + "/" +
      date.day.toString() + "/" + date.year.toString();
    console.log(this.dateConvert)
  }

  eventCheck(event: any) {
    //TODO add account to invite
  }

  createEvent(eventForm: NgForm){
    console.log('create event works')
    console.log(eventForm.value);

    this.eventService.createEvent(eventForm.value as IEvent, this.dateConvert)
  }
  select(model: any){
    console.log(model);
  }


}
