import { Injectable } from '@angular/core';
import {IEvent} from "./interfaces/IEvent";
import {BehaviorSubject, first} from "rxjs";
import {HttpService} from "./http.service";
import {uuid} from "uuidv4";
import {AccountService} from "./account.service";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  curEventList: IEvent[] =[];
  $eventList = new BehaviorSubject<IEvent[]>([]);


  $eventError = new BehaviorSubject<string | null>(null);
  private readonly EVENT_INVALID_EVENT_NAME = "You must provide a valid event name";

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

  createEvent(eventForm: IEvent){
    console.log('create event e s')
    if (eventForm.eventName.length == 0){
      this.$eventError.next(this.EVENT_INVALID_EVENT_NAME)
    }

   //TODO Validation
        const event: IEvent = {
          id: uuid(),
          creatorID: 'test',
          eventDate: eventForm.eventDate,
          eventName: eventForm.eventName,
          invited: [],

        }

    this.httpService.createEvent(event).pipe(first()).subscribe({
      next: (event) => {
        this.$eventList.next(event);
      },
      error: (err) => {
        console.error(err)
        this.$registrationError.next(this.REGISTER_HTTP_ERROR_MESSAGE)
      }
    })
      }

}
