import { Injectable } from '@angular/core';
//TODO import {HttpService} from "./http.service";
import {BehaviorSubject, first, Subject} from "rxjs";
import {IAccount} from "./interfaces/IAccount";
import { v4 as uuidv4 } from 'uuid';
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
//TODO change to null for production & value for testing
  $account = new BehaviorSubject<IAccount | null>(
    {
      "id": "default",
      "email": "default",
      "password": "default",
      "firstName": "default",
      "lastName": "default"
    }
    // null
  )

  $accountList = new Subject<IAccount>();
  accountList: IAccount[] = [];

  $isRegistering = new BehaviorSubject<boolean>(false);
  $registrationError = new BehaviorSubject<string | null>(null);
  $loginError = new BehaviorSubject<string | null>(null);

  private readonly LOGIN_INVALID = "Login is invalid"
  private readonly LOGIN_BLANK = "Please fill in both login fields"
  private readonly LOGIN_HTTP_ERROR = "Unable to login, try again"

  private readonly REGISTER_INVALID_EMAIL_MESSAGE = "You must provide a valid email";
  private readonly REGISTER_INVALID_FIRST_NAME_MESSAGE = "You must provide a first name";
  private readonly REGISTER_INVALID_LAST_NAME_MESSAGE = "You must provide a last name";
  private readonly REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE = "Password must be at least 4 characters";

  //private readonly REGISTER_EXISTING_ACCOUNT_MESSAGE = 'There is already an account with that email';
  private readonly REGISTER_HTTP_ERROR_MESSAGE = 'Unable to create your account, please try again later';

  constructor(
    private httpService: HttpService
  ) {
    this.httpService.getAccounts().subscribe({
      next: (data) => {

        const testArr = Object.values(data).map(y => y.valueOf());
        console.log(testArr);
        //let result = names.map(a => a.testing);
        for (let i = 0; i < testArr.length; i++){
          console.log(testArr[i]);
          this.accountList.push(testArr[i]);
        }

        // @ts-ignore
        this.$accountList.next(this.accountList);

        console.log('testArr to accountlist ' + this.$accountList);
      },
      error: (err) => {
        console.error('db' + err);
      }
    })


  }

  login(email: string, password: string){
    if((email == null) || (password == null)){
      this.$loginError.next(this.LOGIN_BLANK);
      return;
    }
    else{
    console.log("received " + email + " " + password);
    this.httpService.findAccount(email).pipe(first()).subscribe({
      next: (accountList) =>{
        const foundAccount = accountList.find(
          account => account.password === password
        );
        if (!foundAccount) {
          this.$loginError.next(this.LOGIN_INVALID);
          return;
        }
        this.$account.next(foundAccount);
        console.log("account found" + foundAccount);

      },
      error: (err) => {
        console.error(err);
        this.$loginError.next(this.LOGIN_HTTP_ERROR)
      }
    });
    }
  }

  logout(){
    this.$account.next(null);
    console.log(this.$account)
  }

  register(regForm: IAccount){

    // field validation
    if (regForm.email.length < 5 || !regForm.email.includes('@') || !regForm.email.includes('.')) {
      this.$registrationError.next(this.REGISTER_INVALID_EMAIL_MESSAGE);
      console.log('email error')
      return;
    }
    if (regForm.firstName.length < 1) {
      this.$registrationError.next(this.REGISTER_INVALID_FIRST_NAME_MESSAGE);
      return;
    }
    if (regForm.lastName.length < 1) {
      this.$registrationError.next(this.REGISTER_INVALID_LAST_NAME_MESSAGE);
      return;
    }
    if (regForm.password.length < 4) {
      this.$registrationError.next(this.REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE);
      return;
    }

    //TODO check for existing account before reg

    const account: IAccount = {
      id: uuidv4(),
      email: regForm.email,
      password: regForm.password,
      firstName: regForm.firstName,
      lastName: regForm.lastName
    }

    this.httpService.register(account).pipe(first()).subscribe({
      next: (account)=> {
        this.$account.next(account)
      },
      error: (err) => {
        console.log(err)
        this.$registrationError.next(this.REGISTER_HTTP_ERROR_MESSAGE)
      },
    })
    this.$isRegistering.next(false);
  }
}



