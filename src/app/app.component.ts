import {Component, OnDestroy} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AccountService} from "./account.service";
import {Subject, takeUntil} from "rxjs";
import {EventService} from "./event.service";
import {IEvent} from "./interfaces/IEvent";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  title = 'emily-milldrum-calendar-fe';
  isRegistering: boolean = false;
  isLoggedIn: boolean = false;
  selectedEvent: IEvent | null = null;


  onDestroy = new Subject();

  constructor(private modalService: NgbModal,
              private accountService: AccountService,
              private eventService: EventService){

    this.accountService.$account
      .pipe(takeUntil(this.onDestroy))
      .subscribe(account => {
        this.isLoggedIn = !!account;
      });

    this.accountService.$isRegistering.pipe(takeUntil(this.onDestroy))
      .subscribe(isRegistering => {this.isRegistering = isRegistering})

    this.eventService.$selectedEvent.pipe(takeUntil(this.onDestroy)).subscribe(
      curEvent => {this.selectedEvent = curEvent}
    );
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  logoutClick(){
    console.log('logout clicked')
    this.accountService.logout();
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
