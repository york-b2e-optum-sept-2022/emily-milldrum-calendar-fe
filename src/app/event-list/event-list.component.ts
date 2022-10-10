import { Component, OnInit } from '@angular/core';
import {IEvent} from "../interfaces/IEvent";
import {EventService} from "../event.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  eventList: IEvent[] = [];
  onDestroy = new Subject();

  constructor(private eventService: EventService) {
    this.eventService.$eventList.pipe(takeUntil(this.onDestroy)).subscribe(
      eventList => {
        return this.eventList = eventList;
      }
    );
    console.log('event list:' + this.eventList);
    //TODO Error message
  }

  ngOnInit(): void {
  }

  refresh(){
    //TODO
    console.log('refresh test works')
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }


  openEvent() {
    console.log('open event')
  }
}
