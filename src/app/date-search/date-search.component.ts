// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-date-search',
//
// })
import {Component} from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {from} from "rxjs";
import {EventService} from "../event.service";

@Component({
  selector: 'app-date-search',
  templateUrl: './date-search.component.html',
  styleUrls: ['./date-search.component.css']
})
export class DateSearchComponent {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  convertToDate!: Date;
  convertFromDate: Date | null = null;


  constructor(private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private eventService: EventService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.convertFromDate = new Date(this.fromDate.year,
        this.fromDate.month - 1, this.fromDate.day)
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.convertToDate = new Date(this.toDate.year, this.toDate.month - 1,
        this.toDate.day)
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    console.log(parsed);
  }

  goButton(){

      // @ts-ignore
    this.eventService.dateSearch(this.convertFromDate, this.convertToDate);
  }
}

