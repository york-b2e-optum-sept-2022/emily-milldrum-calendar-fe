import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../account.service";
import {IAccount} from "../interfaces/IAccount";

@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.component.html',
  styleUrls: ['./invite-list.component.css']
})
export class InviteListComponent implements OnInit {

  accountList: IAccount[] = [];
  onDestroy = new Subject();
//  @Input() event!: IEvent;

  constructor(private accountService: AccountService) {
    //get event list
    this.accountService.$accountList.pipe(takeUntil(this.onDestroy)).subscribe(
      accountList => {
        this.accountList = accountList;
      }
    );
    //TODO Error message
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
