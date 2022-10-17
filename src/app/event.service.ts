import { Injectable } from '@angular/core';
import {IEvent} from "./interfaces/IEvent";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {HttpService} from "./http.service";
import {AccountService} from "./account.service";
import {v4 as uuidv4} from "uuid";
import {IAccount} from "./interfaces/IAccount";
import {IInvite, IInvite2} from "./interfaces/IInvite";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  //variables
  curEventList: IEvent[] =[];
  $eventList = new BehaviorSubject<IEvent[]>([]);
  currentEvent!: IEvent;
  $selectedEvent = new BehaviorSubject<IEvent | null>(null);

  tempId: string = "";
  private account!: IAccount;
  private accountID: string = "";

  newInviteList!: IInvite2[];
  onDestroy = new Subject();

  $foundOnInvite = new BehaviorSubject<boolean>(false);
  $isEditing = new BehaviorSubject<boolean>(false);

  //error messages
  $eventError = new BehaviorSubject<string | null>(null);
  private readonly EVENT_INVALID_EVENT_NAME = "You must provide a valid event name";
  private readonly EVENT_INVALID_EVENT_DATE = "You must provide a valid event date";
  private readonly EVENT_HTTP_ERROR = "There was an error with the HTTP server";
  private readonly EVENT_MISSING_VALUE = "There is a missing value";


  constructor(private httpService: HttpService,
              private accountService: AccountService) {

    //get event list from server
    this.httpService.getEvents().pipe(first()).subscribe({
      next: eventList => {
        this.curEventList = eventList;
        this.$eventList.next(eventList)
      },
      error: (err) => {
        this.$eventError.next(this.EVENT_HTTP_ERROR);
        console.log(err)
      }
    })

    //get account from account service
    this.accountService.$account.pipe(takeUntil(this.onDestroy)).subscribe(account => {
      if (account) {
        this.account = account
      }
    })
  }

  //delete selected event
  deleteEvent(event: IEvent){
    if (event.id == null){
      this.$eventError.next(this.EVENT_MISSING_VALUE);
    }
    else{
      this.httpService.deleteEvent(event.id).pipe(first()).subscribe({
        next: (data) => {
          this.getEvents();
          this.$selectedEvent.next(null);
        },
        error: (err) => {
          this.$eventError.next(this.EVENT_HTTP_ERROR);
          console.log(err)
        }
      });
    }
  }

  //get event list
  getEvents(){
    this.httpService.getEvents().pipe(first()).subscribe({
      next: eventList => {
        this.curEventList = eventList;
        this.$eventList.next(eventList)
      },
      error: (err) => {
        this.$eventError.next(this.EVENT_HTTP_ERROR);
        console.log(err)
      }
    })
  }


  //create new event
  createEvent(eventForm: IEvent, dateConvert: Date){
    //getInvite
    if (eventForm.eventName.length == 0 || ""){
      this.$eventError.next(this.EVENT_INVALID_EVENT_NAME)
      return;
    }

    if (dateConvert == null || undefined){
      this.$eventError.next(this.EVENT_INVALID_EVENT_DATE)
      return;
    }

    if (this.account.id != null){
      this.accountID = this.account?.id;
    }
    this.tempId =  uuidv4();


    const event: IEvent = {
          id: this.tempId,
          creatorID: this.accountID,
          eventDate: dateConvert,
          eventName: eventForm.eventName
        }
        const invite: IInvite = {
          id: this.tempId,
          invited: this.newInviteList
        }

    //send invites to http/server and use obs
    this.httpService.createNewInvite(invite).pipe(first()).subscribe({
      next: (event) => {
      },
      error: (err) => {
        console.error(err)
        this.$eventError.next(this.EVENT_HTTP_ERROR)
      }
    })
    //send event to http/server and use obs
    this.httpService.createEvent(event).pipe(first()).subscribe({
      next: (event) => {
        this.getEvents();
      },
      error: (err) => {
        console.error(err)
        this.$eventError.next(this.EVENT_HTTP_ERROR)
      }
    })

  }

  //update from list clicked, change boolean & ensure selected event current
  updateClick(event: IEvent){
    this.$selectedEvent.next(event);
    this.$isEditing.next(true);
  }


  //update selected event
    updateEvent(eventForm: IEvent, dateConvert: Date, eventID: string){

      if (eventForm.eventName.length == 0 || ""){
        this.$eventError.next(this.EVENT_INVALID_EVENT_NAME)
        return;
      }

      if (dateConvert == null || undefined){
        this.$eventError.next(this.EVENT_INVALID_EVENT_DATE)
        return;
      }

      if (this.account.id != null){
        this.accountID = this.account?.id;
      }

      const event: IEvent = {
        id: eventID,
        creatorID: this.accountID,
        eventDate: dateConvert,
        eventName: eventForm.eventName
      }
      const invite: IInvite = {
        id: eventID,
        invited: this.newInviteList
      }

      //send invites to http/server and use obs
      this.httpService.updateInvite(invite).pipe(first()).subscribe({
        next: (event) => {
        },
        error: (err) => {
          console.error(err)
          this.$eventError.next(this.EVENT_HTTP_ERROR)
        }
      })

    this.httpService.updateEvent(event).pipe(first()).subscribe({
      next: (event) => {
        this.getEvents();
      },
      error: (err) => {
        console.error(err)
        this.$eventError.next(this.EVENT_HTTP_ERROR)
      }
    })

    this.$isEditing.next(false);
  }

  //search dates
  dateSearch(convertFromDate: Date, convertToDate: Date){
        this.$eventList.next(
          this.curEventList.filter(
            m => new Date(m.eventDate)
           >= new Date(convertFromDate)
          &&
              new Date(m.eventDate) <= new Date(convertToDate)
        ));
  }

  //click on specific event from list and open details
  openEvent(event: IEvent) {
    this.currentEvent = event;
    this.$selectedEvent.next(event);
  }

  closeEvent(){
    this.$selectedEvent.next(null);
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }


  setInviteList(inviteList: IInvite2[]){
    this.newInviteList = inviteList;
    console.log(this.newInviteList)
  }



}
