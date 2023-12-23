import { makeAutoObservable, runInAction } from 'mobx';
import { Store } from './index';
import { message } from 'antd';
import konva from 'konva';
import { UndoRedoElement } from '../../global';
class WebSocketStore {
    rootStore: Store
    socket: WebSocket | null = null;
    messages: string[] = [];
    isconnected: boolean = false;
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    connect(id: string) {
        this.socket = new WebSocket(`${process.env.REACT_APP_REQURST_WSURL}/connect/${id}`, `${this.rootStore.loginRegisterStore.info.token}`);
        this.socket.onopen = () => {
            runInAction(() => {
                this.isconnected = true;
                console.log('websocket connected');
            })
        }
        this.socket.onmessage = (event) => {
            runInAction(() => {
                this.messages.push(event.data);
                this.handleMessages(event.data);
                console.log("get event")
            })
        }
        this.socket.onclose = () => {
            runInAction(() => {
                this.isconnected = false;
                console.log('websocket closed');
            })
        }
        this.socket.onerror = () => {
            runInAction(() => {
                this.isconnected = false;
                console.log('websocket error');
            })
        }
    }
    close() {
        if (this.socket) {
            this.socket.close();
            this.isconnected = false;
        }
    }
    sendMessage(elements: UndoRedoElement[]) {
        console.log('send message');
        for (const element of elements) {
            console.log(element.id, element.type)
        }
        // if (!this.socket) return;
        // const arr=[];
        // const tmp = {
        //     type: type,
        //     data: JSON.stringify(element),
        //     eid: element.id()
        // }
        // arr.push(tmp);
        // this.socket.send(JSON.stringify(arr));
    }
    handleMessages(message: string) {
        console.log("receive message");
        if (this.messages.length === 0) {
            this.rootStore.boardElementStore.pushUndoRedoStack(JSON.parse(message));
            return;
        }
        const elements = JSON.parse(message);
        for (const element of elements) {
            if (element.type === 'update') {
                this.rootStore.boardElementStore.updateActive(element.eid, element.data);
            } else if (element.type === 'create') {
                this.rootStore.boardElementStore.addActive(element.eid, element.data);
            } else if (element.type === 'delete') {
                this.rootStore.boardElementStore.deleteActive(element.eid);
            }
        }
    }
}
export default WebSocketStore;