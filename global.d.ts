declare type UserInfo = {
    username?: string,
    id?: string,
    token?: string,
    avatar?: string,
    email?: string,
    phone?: string,
}
declare type SingleBoard={
    id?:string,
    name?:string,
    owner?:string,
    src?:string,
    members?:string[],
    lastEdit?:string,
}
declare type WhiteBoard = {
    all?:{
        [id:string]:SingleBoard
    }
    mine?:{
        [id:string]:SingleBoard
    }
    others?:{
        [id:string]:SingleBoard
    }
    collection?:{
        [id:string]:SingleBoard
    }
}
export { UserInfo, WhiteBoard,SingleBoard }