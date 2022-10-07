import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../account.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string = "";
  password: string = "";
  errorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private accountService: AccountService) {
    this.accountService.$loginError.pipe(takeUntil(this.onDestroy)).subscribe
    (message => this.errorMessage = message)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  loginClick() {
    console.log("sending " + this.username + " " + this.password);
    this.accountService.login(this.username, this.password);
  }

  registerClick(){
    this.accountService.$isRegistering.next(true);
  }

}
