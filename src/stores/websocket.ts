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
                console.log('receive message');
                this.messages.push(event.data);
                this.handleMessages(event.data);
            })
        }
        this.socket.onclose = () => {
            runInAction(() => {
                console.log('websocket closed 被动');
                this.socket = null;
                this.isconnected = false;
                this.messages = [];
            })
        }
        this.socket.onerror = () => {
            runInAction(() => {
                this.isconnected = false;
                console.log('websocket error');
                this.messages = [];
            })
        }
    }
    close() {
        if (this.isconnected && this.socket) {
            console.log('websocket closed 主动');
            this.socket.close();
            this.isconnected = false;
            this.socket = null;
            this.messages = [];
        }
    }
    sendMessage(elements: UndoRedoElement[]) {
        if (!this.socket) return;
        console.log('send message', elements);
        this.socket.send(JSON.stringify(elements));
    }
    handleMessages(message: string) {
        console.log("handle message", this.messages.length);
        const elements = JSON.parse(message);
        if (this.messages.length === 1) {
            const tmp = [];
            for (const element of elements) {
                const single = konva.Node.create(element.data);
                if (element.type !== 'delete') this.rootStore.boardElementStore.addActive(element.eId, single);
                tmp.push({ ...element, data: single });
            }
            this.rootStore.boardElementStore.pushUndoRedoStack(tmp);
            return;
        }
        for (const element of elements) {
            const single = konva.Node.create(element.data);
            if (element.type === 'update') {
                this.rootStore.boardElementStore.updateActive(element.eId, single);
            } else if (element.type === 'create') {
                this.rootStore.boardElementStore.addActive(element.eId, single);
            } else if (element.type === 'delete') {
                this.rootStore.boardElementStore.deleteActive(element.eId);
            }
        }
    }
}
export default WebSocketStore;