declare type UserInfo = {
    username?: string,
    id?: string,
    token?: string,
    avatar?: string,
    email?: string,
    phone?: string,
}
declare type SingleBoard = {
    id?: string,
    name?: string,
    owner?: string,
    src?: string,
    members?: string[],
    lastEdit?: string,
}
declare type WhiteBoard = {
    all?: {
        [id: string]: SingleBoard
    }
    mine?: {
        [id: string]: SingleBoard
    }
    others?: {
        [id: string]: SingleBoard
    }
    collection?: {
        [id: string]: SingleBoard
    }
}
declare type Status =
    'select' |//正在选择元素
    'move' |//正在移动画布
    'delete' |//正在删除元素
    'edit' |//正在编辑元素
    //创建元素
    'rect' |
    'circle' |
    'line' |
    'text';
export { UserInfo, WhiteBoard, SingleBoard, Status }