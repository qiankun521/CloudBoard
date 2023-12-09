import { makeAutoObservable } from "mobx";
import { Store } from "./index";
import konva from 'konva';
import { Status } from '../../global'
import { Transformer } from 'react-konva';
import { useRef } from "react";
type Element = {
    [key: string]: konva.Shape
}
class BoardElementStore {
    rootStore: Store
    staticElement: Element = {}//静态层元素
    activeElement: Element = {}//动态层元素
    selectElement: { x: number, y: number, width: number, height: number } = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }//框选框
    status: Status = 'select'//当前状态
    moveFlag: boolean = false//是否移动,解决mousemove在不想移动时也触发的问题
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
        const set=new Set(Object.keys(this.staticElement));
        return set;
    }
    get activeIdSet() {
        const set=new Set(Object.keys(this.activeElement));
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
}
export default BoardElementStore;