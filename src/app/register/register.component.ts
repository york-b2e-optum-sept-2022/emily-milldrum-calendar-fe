import { Component, OnInit } from '@angular/core';
import {AccountService} from "../account.service";
import {NgForm} from "@angular/forms";
import {IAccount} from "../interfaces/IAccount";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private accountService: AccountService) {
    this.accountService.$registrationError.pipe(takeUntil(this.onDestroy)).subscribe
    (message => this.errorMessage = message)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onRegisterClick(regForm: NgForm){
    this.accountService.register(
      regForm.value as IAccount)
  }

  cancelRegClick(){
    this.accountService.$isRegistering.next(false);
  }

}
