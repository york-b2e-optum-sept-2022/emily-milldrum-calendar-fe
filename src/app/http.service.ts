import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAccount} from "./interfaces/IAccount";
import {IEvent} from "./interfaces/IEvent";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  findAccount(email: string){
    console.log("hs received " + email);
    console.log('http://localhost:3000/accounts?email=' + email);
    return this.httpClient.get('http://localhost:3000/accounts?email=' + email) as Observable<IAccount[]>
  }

  register(regForm: IAccount){
    return this.httpClient.post(
      'http://localhost:3000/accounts', regForm
    ) as Observable<IAccount>;
  }

  getAccounts()  {
    return this.httpClient.get('http://localhost:3000/accounts')
  }

  getEvents()  {
    return this.httpClient.get('http://localhost:3000/events'
    )as Observable<IEvent[]>;
  }

  deleteEvent(id: string) {
    console.log('delete event http s' + id);

    return this.httpClient.delete<any>('http://localhost:3000/events/' + id
    )//as Observable<string>;
    console.log('http://localhost:3000/events/' + id);
  }

  findEvent(eventDate: any){
    console.log('find event') //TODO
    return
  }

  createEvent(event: IEvent){
    console.log('create event') //TODO
    return this.httpClient.post(
      'http://localhost:3000/events', event
    ) as Observable<IEvent>;
  }

}
