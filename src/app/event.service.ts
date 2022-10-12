import { Injectable } from '@angular/core';
import {IEvent} from "./interfaces/IEvent";
import {BehaviorSubject, first} from "rxjs";
import {HttpService} from "./http.service";
import {AccountService} from "./account.service";
import {v4 as uuidv4} from "uuid";
import {IAccount} from "./interfaces/IAccount";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  curEventList: IEvent[] =[];
  $eventList = new BehaviorSubject<IEvent[]>([]);
  $event = new BehaviorSubject<IEvent | null>(null);
  $selectedEvent = new BehaviorSubject<IEvent | null>(null);

  $eventError = new BehaviorSubject<string | null>(null);
  private readonly EVENT_INVALID_EVENT_NAME = "You must provide a valid event name";
  private readonly EVENT_HTTP_ERROR = "There was an error with the HTTP server";
  private account!: IAccount;
  private accountID: string = "";

  constructor(private httpService: HttpService,
              private accountService: AccountService) {
    this.httpService.getEvents().pipe(first()).subscribe({
      next: eventList => {
        this.curEventList = eventList;
        this.$eventList.next(eventList)
      }
    })

    this.accountService.$account.subscribe(account => {
      if (account) {
        this.account = account
      }
    })
  }

  deleteEvent(event: IEvent){
    // this.curEventList = this.curEventList.filter(events => events !== event)
    // console.log('es delete works')
    // console.log(this.curEventList);
    // this.$eventList.next(this.curEventList);
    this.httpService.deleteEvent(event.id).pipe(first()).subscribe({
      next: (data) => {
        console.log(data);
        this.getEvents();
        this.$selectedEvent.next(null);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getEvents(){
    this.httpService.getEvents().pipe(first()).subscribe({
      next: eventList => {
        this.curEventList = eventList;
        this.$eventList.next(eventList)
      }
    })
  }

  createEvent(eventForm: IEvent, dateConvert: Date, eventList: IAccount[]){
    console.log('create event e s')
    if (eventForm.eventName.length == 0){
      this.$eventError.next(this.EVENT_INVALID_EVENT_NAME)
    }

    // @ts-ignore
    if (this.account.id != null){
      this.accountID = this.account?.id;
    }
   //TODO Validation
    const event: IEvent = {
          id: uuidv4(),
          creatorID: this.accountID,
          eventDate: dateConvert,
          eventName: eventForm.eventName,
          invited: {
            id: eventList}

        }

    console.log(eventForm.eventDate)
    this.httpService.createEvent(event).pipe(first()).subscribe({
      next: (event) => {
        //this.$event.next(event);
        this.getEvents();
        console.log('http adding ' + event);
      },
      error: (err) => {
        console.error(err)
        this.$eventError.next(this.EVENT_HTTP_ERROR)
      }
    })
      }

  dateSearch(convertFromDate: Date, convertToDate: Date){
        console.log('e s datesearch' + convertFromDate + " " + convertToDate)
        this.$eventList.next(
          this.curEventList.filter(
            m => new Date(m.eventDate)
           >= new Date(convertFromDate)
          &&
              new Date(m.eventDate) <= new Date(convertToDate)
        ));
  }

  openEvent(event: IEvent) {
    console.log("e s open event");
    console.log(event)
    this.$selectedEvent.next(event);

  }
  closeEvent(){
    this.$selectedEvent.next(null);
  }

}
