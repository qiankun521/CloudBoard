import { makeAutoObservable } from 'mobx';
import { Store } from './index';
class TipsStore {
    rootStore: Store
    tips: string[] = [
        '画布右下角可以切换拖动模式',
        '在左上角可以把画布保存为图片哦',
        '可以通过右上角的按钮分享画布给小伙伴',
        '画布上的元素可以拖动哦',
    ];
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    addTips(tip: string) {
        this.tips.push(tip);
    }
    removeTips(tip: string) {
        this.tips = this.tips.filter((item) => item !== tip);
    }
}
export default TipsStore;