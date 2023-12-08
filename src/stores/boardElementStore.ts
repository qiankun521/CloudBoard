import { makeAutoObservable } from "mobx";
import { Store } from "./index";
import konva from 'konva';
import { Status } from '../../global'
type Element = {
    [key: string]: konva.Shape
}
class BoardElementStore {
    rootStore: Store
    staticElement: Element = {}//静态层元素
    activeElement: Element = {}//动态层元素
    selectElement: konva.Rect//框选框
    status: Status = 'select'//当前状态
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.selectElement = new konva.Rect()
    }
    get static() {
        return Object.entries(this.staticElement);
    }
    get active() {
        return Object.entries(this.activeElement);
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
    changeActiveToStatic(id?: string | string[]) {//id为转换的id，为undefined时，全部转换,id2为不转换的id
        if (id && typeof id === "string") {
            this.staticElement[id] = this.activeElement[id].clone();
            delete this.activeElement[id];
        } else if (id && typeof id === "object") {
            id.forEach((item) => {
                this.staticElement[item] = this.activeElement[item].clone();
                delete this.activeElement[item];
            })
        }
    }
    changeStaticToActive(id: string | string[]) {
        if (typeof id === "string") {
            if (!this.staticElement[id]) return;
            this.activeElement[id] = this.staticElement[id].clone();
            delete this.staticElement[id];
        } else {
            id.forEach((item) => {
                if (!this.staticElement[item]) return;
                this.activeElement[item] = this.staticElement[item].clone();
                delete this.staticElement[item];
            })
        }
    }

}
export default BoardElementStore;