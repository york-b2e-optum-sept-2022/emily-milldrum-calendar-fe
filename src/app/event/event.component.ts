import {Component, Input, OnInit} from '@angular/core';
import {IEvent} from "../interfaces/IEvent";
import {EventService} from "../event.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event!: IEvent;
  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

  onUpdateClick(event: IEvent){
    //TODO
    console.log('update click works')
  }

  onDeleteClick(event: IEvent){
    console.log('delete click works')
    this.eventService.deleteEvent(this.event);
  }


}
