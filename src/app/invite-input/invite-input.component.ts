import {Component, OnInit, SimpleChanges} from '@angular/core';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";

@Component({
  selector: 'app-datepicker',
  templateUrl: './invite-input.component.html',
  styleUrls: ['./invite-input.component.css']
})
export class InviteInputComponent implements OnInit {
  accountList: IAccount[];
  list: IAccount[] = [];

  constructor(private accountService: AccountService) {
    // @ts-ignore
    this.accountList = this.accountService.$accountList;
    this.accountService.$accountList.subscribe((newList) => {
      // @ts-ignore
      this.list = newList
      this.accountList = [...this.list];})
  }

  ngOnInit(): void {
    //this.accountList = [...this.list];
  }
  //
  // ngOnChanges(changes: SimpleChanges){
  //   this.accountList = [...this.list];
  // }


  onDateSelect(date: NgbDate){
    console.log(date)
  }

  eventCheck(event: any){
    console.log('changing invite status')
  }
}
