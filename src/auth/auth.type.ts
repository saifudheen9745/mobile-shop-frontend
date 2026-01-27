export interface IRegisterPayload {
    email:String,
    name:String,
    phone:String,
    password:String
}

export interface ILoginPayload {
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
    name:String,
    phone:String,
}