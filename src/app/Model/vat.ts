export class VAT {
  vatid: number | undefined;
  percentage: number | undefined;
  date: Date | undefined;


 
  constructor() {
    this.vatid = 0;
    this.percentage = 0;
    this.date = new Date();
  }
}
