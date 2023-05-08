// discount.ts
export class Discount {
    discountID: number | undefined;
    discountCode: string | undefined;
    discountDescription: string | undefined;
    discountAmount: number | undefined;
  
    constructor() {
      this.discountID = 0;
      this.discountCode = "This code will be generated";
      this.discountDescription = "To who and for what reason?";
      this.discountAmount = 0;
    }
  }
  