import BoardElementStore from "./boardElementStore";
import LoginRegisterStore from "./loginRegister";
import ModalStore from "./modal";
import TipsStore from "./tips";
import { makeAutoObservable } from "mobx";
export class Store{
    boardElementStore
    loginRegisterStore
    modalStore
    tipsStore
    constructor(){
        makeAutoObservable(this);
        this.boardElementStore=new BoardElementStore(this);
        this.loginRegisterStore=new LoginRegisterStore(this);
        this.modalStore=new ModalStore(this);
        this.tipsStore=new TipsStore(this);
    }
}
const store =new Store();
export default store;