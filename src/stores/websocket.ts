import { makeAutoObservable } from 'mobx';
import { Store } from './index';
import { message } from 'antd';
class WebSocketStore {
    rootStore: Store
    socket: WebSocket | null = null;
    messages: string[] = [];
    isconnected: boolean = false;
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    connect() {
        this.socket = new WebSocket(`${process.env.REACT_APP_REQUEST_URL}/websocket`);
        this.socket.onopen = () => {
            this.isconnected = true;
        }
        this.socket.onmessage = (event) => {
            this.messages.push(event.data);
            this.handleMessages(event.data);
        }
        this.socket.onclose = () => {
            this.isconnected = false;
        }
        this.socket.onerror = () => {
            this.isconnected = false;
            message.error('网络异常,连接断开');
        }
    }
    close() {
        if (this.socket) {
            this.socket.close();
            this.isconnected = false;
        }
    }
    sendMessage(message: string) {
        if (this.socket) {
            this.socket.send(message);
        }
    }
    handleMessages(message: string) {
        console.log("message", message);
    }
}
export default WebSocketStore;