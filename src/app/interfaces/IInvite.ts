export interface IInvite{
  id: string;
  invited: IInvite2[]
}
export interface IInvite2{
    accountID: string;
    email: string;
    firstName: string;
    lastName: string;
}
