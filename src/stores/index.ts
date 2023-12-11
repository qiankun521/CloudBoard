import BoardElementStore from "./boardElement";
import LoginRegisterStore from "./loginRegister";
import ModalStore from "./modal";
import TipsStore from "./tips";
import WebSocketStore from "./websocket";
import { makeAutoObservable } from "mobx";
export class Store {
    boardElementStore
    loginRegisterStore
    modalStore
    tipsStore
    websocketStore
    constructor() {
        makeAutoObservable(this);
        this.boardElementStore = new BoardElementStore(this);
        this.loginRegisterStore = new LoginRegisterStore(this);
        this.modalStore = new ModalStore(this);
        this.tipsStore = new TipsStore(this);
        this.websocketStore = new WebSocketStore(this);
    }
}
const store = new Store();
export default store;