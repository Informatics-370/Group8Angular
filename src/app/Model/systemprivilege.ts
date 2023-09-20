import { MethodPrivilegeMapping } from "./methodPrivilegeMapping";

export class SystemPrivilege{
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    controllerMethods: MethodPrivilegeMapping[] = [];

    constructor() {
        this.controllerMethods = [];
    }
}