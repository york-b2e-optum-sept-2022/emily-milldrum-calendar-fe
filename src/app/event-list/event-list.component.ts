import {Component, Input, OnInit} from '@angular/core';
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
  @Input() event!: IEvent;

  constructor(private eventService: EventService) {
    //get event list
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

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  openEvent(event: IEvent) {
    this.eventService.openEvent(event)
  }
}
