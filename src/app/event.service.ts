import { Injectable } from '@angular/core';
import {IEvent} from "./interfaces/IEvent";
import {BehaviorSubject, first, Subject, takeUntil} from "rxjs";
import {HttpService} from "./http.service";
import {AccountService} from "./account.service";
import {v4 as uuidv4} from "uuid";
import {IAccount} from "./interfaces/IAccount";
import {IInvite, IInvite2} from "./interfaces/IInvite";
import {InvitesService} from "./invites.service";

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
  //TODO
  newInvite: any;
  newInviteList!: IInvite2[];

  onDestroy = new Subject();

  $isEditing = new BehaviorSubject<boolean>(false);

  $eventError = new BehaviorSubject<string | null>(null);

  //error messages
  private readonly EVENT_INVALID_EVENT_NAME = "You must provide a valid event name";
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
          console.log(data);
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
  createEvent(eventForm: IEvent, dateConvert: Date, eventList: IInvite[]){
    //getInvite
    if (eventForm.eventName.length == 0){
      this.$eventError.next(this.EVENT_INVALID_EVENT_NAME)
    }

    if (this.account.id != null){
      this.accountID = this.account?.id;
    }

   //TODO Validation
    this.tempId =  uuidv4();


    const event: IEvent = {
          id: this.tempId,
          creatorID: this.accountID,
          eventDate: dateConvert,
          eventName: eventForm.eventName,
         // invited: this.newInviteList
        }
        const invite: IInvite = {
          id: this.tempId,
          invited: this.newInviteList
        }

    console.log(event)
    console.log(invite)

    //send invites to http/server and use obs
    this.httpService.createNewInvite(invite).pipe(first()).subscribe({
      next: (event) => {
        //TODO FIX?
        // this.getInvites();
        // this.$eventList.next(event);
        //get updated event list

      },
      error: (err) => {
        console.error(err)
        this.$eventError.next(this.EVENT_HTTP_ERROR)
      }
    })
    //send event to http/server and use obs
    this.httpService.createEvent(event).pipe(first()).subscribe({
      next: (event) => {
        //TODO FIX?
        this.getEvents();
       // this.$eventList.next(event);
        //get updated event list

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
  //
  // updateEvent(editEvent: IEvent, dateConvert: Date, eventList: IInvite[]){
    updateEvent(updateEvent: any){
    console.log(updateEvent)

    const event: IEvent  = {
      id: updateEvent.id,
      creatorID: updateEvent.creatorID,
      eventDate: updateEvent.eventDate,
      eventName: updateEvent.eventName,
     // invited: [this.newInviteList]

    }

    this.httpService.updateEvent(event).pipe(first()).subscribe({
      next: (event) => {
        //TODO FIX?
        //this.$event.next(event);
        this.getEvents();
        console.log('http updating ' + event);
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
        console.log('e s datesearch' + convertFromDate + " " + convertToDate)
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


  addInvite(account: IAccount, event: IEvent) {
    console.log('event service add')

    //this.httpService.....push(this.newInviteList)

    //const existingID = event.invited.find(inviteID => inviteID.invited.id === newInvite.id)
    // event.invited.push(newInvite);
    // this.httpService.updateEvent(event).pipe(first()).subscribe({next: (cart) =>
    //   {this.$selectedEvent.next(event);
    //   },
    //   error: (err) => {
    //     //TODO
    //     console.error(err);
    //   }
    // });
  }
}
