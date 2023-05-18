// blacklist.ts
export class Blacklist {
    blacklistID: number | undefined;
    userID: number | undefined;
    email: string | undefined;
    reason: string | undefined;
  
    constructor() {
      this.blacklistID = 0;
      this.userID = 0;
      this.email = "";
      this.reason = "";
    }
  }
  