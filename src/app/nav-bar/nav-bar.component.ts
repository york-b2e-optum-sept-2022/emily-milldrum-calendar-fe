import { Component, OnInit } from '@angular/core';
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  account: IAccount | null = null;
  onDestroy = new Subject();

  constructor(private accountService: AccountService) {
    //get account info for name display
    this.accountService.$account
      .pipe(takeUntil(this.onDestroy))
      .subscribe(account => {
        this.account = account
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  logoutClick(){
    this.accountService.logout();
  }
}
