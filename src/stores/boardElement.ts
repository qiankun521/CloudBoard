import { makeAutoObservable } from "mobx";
import { Store } from "./index";
import konva from 'konva';
import { Status } from '../../global'
import { UndoRedoElement } from '../../global'
type Element = {
    [key: string]: konva.Shape
}
class BoardElementStore {
    rootStore: Store
    undoRedoStack: UndoRedoElement[][] = []//撤销重做栈
    undoRedoElement: UndoRedoElement[] = []//撤销重做元素
    stackIndex: number = -1//栈指针
    staticElement: Element = {}//静态层元素
    activeElement: Element = {}//动态层元素
    selectElement: { x: number, y: number, width: number, height: number } = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }//框选框
    createElement: { lastX: number, lastY: number, x: number, y: number } = {
        lastX: 0,
        lastY: 0,
        x: 0,
        y: 0
    }//创建元素
    createAdvancedElement: number[] = []
    status: Status = 'select'//当前状态
    moveFlag: boolean = false//是否移动,解决mousemove在不想移动时也触发的问题
    createFlag: boolean = false//是否创建,解决mousemove在不想创建时也触发的问题,如曲线
    scaleX: number = 1//缩放比例
    scaleY: number = 1//缩放比例
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    get static() {
        return Object.entries(this.staticElement);
    }
    get active() {
        return Object.entries(this.activeElement);
    }
    get staticIdSet() {
        const set = new Set(Object.keys(this.staticElement));
        return set;
    }
    get activeIdSet() {
        const set = new Set(Object.keys(this.activeElement));
        return set;
    }
    addStatic(id: string, element: konva.Shape) {
        this.staticElement[id] = element;
    }
    addActive(id: string, element: konva.Shape) {
        this.activeElement[id] = element;
    }
    updateActive(id: string, element: konva.Shape) {
        this.activeElement[id] = element;
    }
    updateStatic(id: string, element: konva.Shape) {
        this.staticElement[id] = element;
    }
    deleteActive(id: string) {
        delete this.activeElement[id];
    }
    deleteStatic(id: string) {
        delete this.staticElement[id];
    }
    updateSelect(point?: { x: number, y: number }, wH?: { x: number, y: number }) {
        if (point && !wH) {
            this.selectElement = {
                ...this.selectElement,
                x: point.x,
                y: point.y,
            }
        } else if (wH && !point) {
            this.selectElement = {
                ...this.selectElement,
                width: wH.x - this.selectElement.x,
                height: wH.y - this.selectElement.y,
            }
        } else {
            this.selectElement = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
    }
    updateCreate(last?: { x: number, y: number }, now?: { x: number, y: number }) {//更新创建元素的坐标
        if (last && now) {
            this.createElement = {
                ...this.createElement,
                lastX: last.x,
                lastY: last.y,
                x: now.x,
                y: now.y
            }
        }
        else if (last && !now) {
            this.createElement = {
                ...this.createElement,
                lastX: last.x,
                lastY: last.y
            }
        } else if (now && !last) {
            this.createElement = {
                ...this.createElement,
                x: now.x,
                y: now.y
            }
        } else {
            this.createElement = {
                lastX: 0,
                lastY: 0,
                x: 0,
                y: 0
            }
        }
    }
    updateCreateAdvanced(point?: number[]) {//更新创建复杂元素的坐标
        if (point) {
            this.createAdvancedElement.push(...point);
        } else {
            this.createAdvancedElement = [];
        }
    }
    changeActiveToStatic(id?: string | string[]) {//id为转换的id，为undefined时，全部转换
        if (id && typeof id === "string") {
            this.staticElement[id] = this.activeElement[id];
            delete this.activeElement[id];
        } else if (id && typeof id === "object") {
            id.forEach((item) => {
                this.staticElement[item] = this.activeElement[item];
                delete this.activeElement[item];
            })
        }
        // else{
        //     Object.entries(this.activeElement).forEach(([key,value])=>{
        //         this.staticElement[key] = value;
        //         delete this.activeElement[key];
        //     })
        // }
    }
    changeStaticToActive(id: string | string[]) {
        if (typeof id === "string") {
            if (!this.staticElement[id]) return;
            this.activeElement[id] = this.staticElement[id];
            delete this.staticElement[id];
        } else {
            id.forEach((item) => {
                if (!this.staticElement[item]) return;
                this.activeElement[item] = this.staticElement[item];
                delete this.staticElement[item];
            })
        }
    }
    changeStatus(status: Status) {
        this.status = status;
    }
    updateScale(scaleX: number, scaleY: number) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
    pushUndoRedoStack(element: UndoRedoElement[], type?: string) {
        if (type === 'temp') {//temp为临时元素，不需要推入栈，发送给后端传递做元素变换的过程
            this.rootStore.websocketStore.sendMessage(element);
            this.undoRedoElement = [];
            return;
        }
        if (this.stackIndex !== -1) this.rootStore.websocketStore.sendMessage(element);
        if (this.stackIndex !== this.undoRedoStack.length - 1) this.undoRedoStack.splice(this.stackIndex + 1);
        this.undoRedoStack.push(element);
        this.stackIndex = this.undoRedoStack.length - 1;
        this.undoRedoElement = [];
        console.log('push undo redo stack', this.stackIndex, this.undoRedoStack.length)
    }
    popUndoRedoStack() {
        if (this.stackIndex - 1 < 0) return;
        const elements = this.undoRedoStack[this.stackIndex];
        for (const element of elements) {
            let flag = false;
            switch (element.type) {
                case 'create':
                    delete this.activeElement[element.eId];
                    break;
                case 'delete':
                    this.activeElement[element.eId] = element.data;
                    break;
                case 'update':
                    for (let i = this.stackIndex - 1; i >= 0; i--) {
                        for (const item of this.undoRedoStack[i]) {
                            if (item.eId === element.eId) {
                                this.activeElement[element.eId] = item.data;
                                flag = true;
                                break;
                            }
                        }
                        if (flag) break;
                    }
                    if (!flag) console.error('undo redo error');
                    break;
                case 'temp':
                    for (let i = this.stackIndex - 1; i >= 0; i--) {
                        for (const item of this.undoRedoStack[i]) {
                            if (item.eId === element.eId) {
                                this.activeElement[element.eId] = item.data;
                                flag = true;
                                break;
                            }
                        }
                        if (flag) break;
                    }
                    if (!flag) console.error('undo redo error');
                    break;
                default:
                    console.error('undo redo error');
                    break;
            }
        }
        this.stackIndex--;
    }
    reset() {
        this.undoRedoStack = [];
        this.undoRedoElement = [];
        this.stackIndex = -1;
        this.staticElement = {};
        this.activeElement = {};
    }
    pushUndoRedoElement(element: UndoRedoElement) {
        this.undoRedoElement.push(element);
    }
}
export default BoardElementStore;