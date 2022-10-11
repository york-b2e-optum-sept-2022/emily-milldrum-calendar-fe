import { Injectable } from '@angular/core';
import {IEvent} from "./interfaces/IEvent";
import {BehaviorSubject, first} from "rxjs";
import {HttpService} from "./http.service";
import {uuid} from "uuidv4";
import {AccountService} from "./account.service";
import {v4 as uuidv4} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  curEventList: IEvent[] =[];
  $eventList = new BehaviorSubject<IEvent[]>([]);
  $event = new BehaviorSubject<IEvent | null>(null);


  $eventError = new BehaviorSubject<string | null>(null);
  private readonly EVENT_INVALID_EVENT_NAME = "You must provide a valid event name";
  private readonly EVENT_HTTP_ERROR = "There was an error with the HTTP server";

  constructor(private httpService: HttpService, private accountService: AccountService) {
    this.httpService.getEvents().pipe(first()).subscribe({
      next: eventList => {
        this.curEventList = eventList;
        this.$eventList.next(eventList)
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

  createEvent(eventForm: IEvent, dateConvert: string){
    console.log('create event e s')
    if (eventForm.eventName.length == 0){
      this.$eventError.next(this.EVENT_INVALID_EVENT_NAME)
    }

   //TODO Validation
        const event: IEvent = {
          id: uuidv4(),
          creatorID: 'test',
          eventDate: dateConvert,
          eventName: eventForm.eventName,
          invited: [eventForm.invited],

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

}
