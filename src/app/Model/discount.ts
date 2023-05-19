// discount.ts
export class Discount {
    discountID: number | undefined;
    discountCode: string | undefined;
    discountDescription: string | undefined;
    discountAmount: number | undefined;
  
    constructor() {
      this.discountID = 0;
      this.discountCode = "This code will be generated";
      this.discountDescription = "";
      this.discountAmount = 0;
    }
  }
  