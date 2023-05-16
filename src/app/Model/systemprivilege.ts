export class SystemPrivilege{
    systemPrivilegeID: number | undefined;
    privilege_Name: string | undefined;
    privilege_Description: string | undefined;
    userID: number | undefined;
    constructor() {
        this.systemPrivilegeID = 0;
        this.privilege_Name = '';
        this.privilege_Description = '';
        this.userID = 1;
    }
}