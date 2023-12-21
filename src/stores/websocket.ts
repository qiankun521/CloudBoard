import { makeAutoObservable } from 'mobx';
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
    sendMessage(elements: UndoRedoElement[]) {
        console.log('send message');
        for(const element of elements){
            console.log(element.id,element.type)
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
        //TODO 初次建立连接后，服务器会发送目前白板所有元素的信息
        const elements=JSON.parse(message);
        console.log("receive message");
        for(const element of elements){
            console.log(element.id,element.type)
        }
    }
}
export default WebSocketStore;