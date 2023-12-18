import { makeAutoObservable } from 'mobx';
import { Store } from './index';
import { message } from 'antd';
import konva from 'konva';
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
            console.log('websocket connected');
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
    sendMessage(element: konva.Shape, type: string) {
        console.log('send message', element.id());
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
        //TODO 初次建立连接后，服务器会发送目前白板所有元素的信息
        
        console.log("message", message);
    }
}
export default WebSocketStore;