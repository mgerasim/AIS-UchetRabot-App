export interface IApiResult<T = void> {
    HasError: boolean,
    ErrorMessage: string,
    Result: T,
}