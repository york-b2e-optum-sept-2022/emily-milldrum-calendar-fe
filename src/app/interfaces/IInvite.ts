export interface IInvite{
  id: string;
  invited: {
    accountID: string;
    email: string;
    firstName: string;
    lastName: string;
    }
}
