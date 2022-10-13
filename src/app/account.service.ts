import { Injectable } from '@angular/core';
import {BehaviorSubject, first} from "rxjs";
import {IAccount} from "./interfaces/IAccount";
import { v4 as uuidv4 } from 'uuid';
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //variables
//TODO change to null for production & value for testing
  $account = new BehaviorSubject<IAccount | null>(
    {
      "id": "ca4f1cd6-bfa1-48c0-a511-bf24ef23114d",
      "email": "default",
      "password": "default",
      "firstName": "Emily",
      "lastName": "Testing"
    }
    // null

  )

  $accountList = new BehaviorSubject<IAccount[]>([]);
  accountList: IAccount[] = [];
  account: IAccount[]= this.accountList;
  $isRegistering = new BehaviorSubject<boolean>(false);
  $registrationError = new BehaviorSubject<string | null>(null);
  $loginError = new BehaviorSubject<string | null>(null);


  //error messages
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
    //get list of accounts
    this.httpService.getAccounts().subscribe({
      next: (data) => {

        const getAccounts = Object.values(data).map(y => y.valueOf());
        for (let i = 0; i < getAccounts.length; i++){
          this.accountList.push(getAccounts[i]);
        }
        this.$accountList.next(this.accountList);
      },
      error: (err) => {
        console.error(err);
        this.$loginError.next(this.LOGIN_HTTP_ERROR)
      }
    })


  }

  //account login
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
  }


  //register new account
  register(regForm: IAccount){

    // field validation
    if (regForm.email.length < 5 || !regForm.email.includes('@') || !regForm.email.includes('.')) {
      this.$registrationError.next(this.REGISTER_INVALID_EMAIL_MESSAGE);
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



