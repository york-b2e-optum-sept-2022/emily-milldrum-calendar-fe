import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../interfaces/IEvent";
import {EventService} from "../event.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  events: IEvent | null = null;

  @Input() event!: IEvent;

  onDestroy = new Subject();

  constructor(private eventService: EventService) {
    this.eventService.$event.pipe(takeUntil(this.onDestroy))
      .subscribe(
        (event) => {
          this.events = event;
        }
      )
  }

  ngOnInit(): void {
  }

  onUpdateClick(event: IEvent){
    //TODO
    console.log('update click works')
  }

  onDeleteClick(event: IEvent){
    console.log('delete click works')
    this.eventService.deleteEvent(event);
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }


}
