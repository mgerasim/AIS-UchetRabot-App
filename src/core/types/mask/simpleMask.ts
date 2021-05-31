interface ISimpleMask {
    Id?: number,
    Name: string,
    Number?: number,
    Priority: number,
    System: IEnumModel,
    IsDeleted: boolean,
    CatalogItem: any,
    RootCatalogItem?: any,
}

export default ISimpleMask;