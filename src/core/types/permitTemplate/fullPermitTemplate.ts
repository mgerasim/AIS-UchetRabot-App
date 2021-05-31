import ISimplePermitTemplate from "@/core/types/permitTemplate/simplePermitTemplate";

export default interface IFullPermitTemplate extends ISimplePermitTemplate {
    FullDescription: string,
    EquipmentType: any, //EnumViewModel
    WorkType: any, //EnumViewModel
    IsLinearPart: boolean,
    HasMna?: boolean,
    NeedOutputToRepairMna?: boolean,
    HasAvrMna?: boolean,
    HasPna?: boolean,
    NeedOutputToRepairPna?: boolean,
    HasAvrPna?: boolean,
    IsLocked: boolean,
    PermitTemplateCatalog: any, //PermitTemplateCatalogModel
    PermitTemplateObjects: any[],   //PermitTemplateObjectModel[]
    MaskGroups: any[],  //MaskGroupModel[]
}