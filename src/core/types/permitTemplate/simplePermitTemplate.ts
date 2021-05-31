export default interface ISimplePermitTemplate {
    Id?: number,
    Name: string,
    Description: string,
    File: any,  //NewFileModel
    NeedNpsMask: boolean,
    NeedEsuMask: boolean,
    NeedCspaMask: boolean,
    CatalogItemId: number,
}