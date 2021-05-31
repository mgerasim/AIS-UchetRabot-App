import ISimplePermit from "@/core/types/permit//simplePermit";
import IFullPermitTemplate from "../permitTemplate/fullPermitTemplate";

export default interface IFullPermit extends ISimplePermit {
    FullDescription: string,
    TimePeriods: [any], //PermitTimePeriodModel[]
    MaskGroups: [any],  //MaskGroupModel[]
    PermitObjects: [any],   //PermitObjectModel[]
    ResponsiblePersons: [any],  //PermitResponsiblePersonModel[]
    IsLinearPart: boolean,
    HasMna?: boolean,
    NeedOutputToRepairMna?: boolean,
    HasAvrMna?: boolean,
    HasPna?: boolean,
    NeedOutputToRepairPna?: boolean,
    HasAvrPna?: boolean,
    To: string,
    ToPosition: string,
    ToName: string,
    From: string,
    FromPosition: string,
    FromName: string,
    EmergencyTime?: number,
    PermitFile: any,    //NewFileModel
    EquipmentType: any, //EnumViewModel
    WorkType: any,  //EnumViewModel
    NeedNpsMask: boolean,
    NeedEsuMask: boolean,
    NeedCspaMask: boolean,
    IsPipelinePlannedShutdown: boolean,
    PermitTemplate: IFullPermitTemplate,
    SigningDateUtc?: any,   //DateTime
    GeneratedFile: any, //NewFileModel
    GeneratedMainFile: any, //NewFileModel
    GeneratedMpsaAttachmentFile: any,   //NewFileModel
    GeneratedEsuAttachmentFile: any,    //NewFileModel
    GeneratedCspaAttachmentFile: any,   //NewFileModel
    GenerationDate?: any,   //DateTime
    SedDocumentNumber: string,
    SedDocumentDate?: any,  //DateTime

    SedDocument: any,   //SedDocumentModel 
}