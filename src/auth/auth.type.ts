export interface IAuthPayload {
    email:String,
    password:String
}

export interface IJwtPayload {
    id:string,
    email:string
}

export interface IAuthResponse {
    id:String,
    email:String,
    tokan:String,
}