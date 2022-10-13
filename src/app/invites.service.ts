import { Injectable } from '@angular/core';
import {IInvite} from "./interfaces/IInvite";

@Injectable({
  providedIn: 'root'
})
export class InvitesService {

  constructor() { }

  invitedList:  IInvite[] = [];

  getInviteList(){

  }

  addInvite(){

  }
  removeInvite(){

  }


}
