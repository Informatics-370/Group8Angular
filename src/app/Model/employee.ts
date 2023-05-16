export class Employee{
    employeeID: number | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    phone_number: string | undefined;
    id_number: string | undefined;
    hire_date: Date | undefined;
    userID: number | undefined;
    superUserID : number | undefined;

    constructor(){   
        this.employeeID = 0;
        this.first_name = '';     
        this.last_name = '';     
        this.email = '';     
        this.phone_number = '';     
        this.id_number = '';     
        this.hire_date = new Date();
        this.userID = 0;
        this.superUserID = 0;     
    }
}