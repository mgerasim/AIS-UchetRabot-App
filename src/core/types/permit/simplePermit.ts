import IEnumModel from "@/core/types/enumModel";

export default interface ISimplePermit {
    Id?: number,
    Description: string,
    Date?: any,  //DateTime
    Number: string,
    Branch: any,    //BranchModel
    Department: any,    //DepartmentViewModel
    Status: IEnumModel, //EnumModel<PermitStatus> 
}