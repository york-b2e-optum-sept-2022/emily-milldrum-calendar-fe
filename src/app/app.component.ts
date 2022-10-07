import {Component, OnDestroy} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AccountService} from "./account.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {

  title = 'emily-milldrum-calendar-fe';
  isRegistering: boolean = false;
  isLoggedIn: boolean = false;

  onDestroy = new Subject();

  constructor(private modalService: NgbModal, private accountService: AccountService){
    this.accountService.$account
      .pipe(takeUntil(this.onDestroy))
      .subscribe(account => {
        this.isLoggedIn = !!account;
      });
    this.accountService.$isRegistering.pipe(takeUntil(this.onDestroy))
      .subscribe(isRegistering => {this.isRegistering = isRegistering})
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
