export class Employee{
    employeeID: number | undefined;
    first_Name: string | undefined;
    last_Name: string | undefined;
    email: string | undefined;
    phone_Number: string | undefined;
    iD_Number: string | undefined;
    hire_Date: Date;
    userID: number | undefined;
    superUserID : number | undefined;

    constructor(){   
        this.employeeID = 0;
        this.first_Name = '';     
        this.last_Name = '';     
        this.email = '';     
        this.phone_Number = '';     
        this.iD_Number = '';     
        this.hire_Date = new Date();
        this.userID = 1;
        this.superUserID = 1;     
    }
}