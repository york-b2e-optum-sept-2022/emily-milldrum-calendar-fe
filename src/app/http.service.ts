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


  //TODO
  // getProductList(){
  //   return this.httpClient.get('http://localhost:3000/products'
  //   )as Observable<IProduct[]>;
  // }
}
