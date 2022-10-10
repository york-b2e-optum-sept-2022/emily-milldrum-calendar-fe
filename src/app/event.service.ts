import { Injectable } from '@angular/core';
import {IEvent} from "./interfaces/IEvent";
import {BehaviorSubject, first} from "rxjs";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  curEventList: IEvent[] =[];
  $eventList = new BehaviorSubject<IEvent[]>([]);


  constructor(private httpService: HttpService) {
    this.httpService.getEvents().pipe(first()).subscribe({
      next: eventList => {
        this.curEventList = eventList;
        this.$eventList.next(eventList)
      }
    })
  }
}
