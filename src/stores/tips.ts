import { makeAutoObservable } from 'mobx';
import { Store } from './index';
class TipsStore {
    rootStore: Store
    tips: string[] = [
        '111按住空格键可以拖动画布哦o(￣▽￣)ｄ',
        '444按住Crtl键可以放缩画布哦o(￣▽￣)ｄ',
        '222按住空格键可以拖动画布哦o(￣▽￣)ｄ',
        '555按住Crtl键可以放缩画布哦o(￣▽￣)ｄ',
        '333按住空格键可以拖动画布哦o(￣▽￣)ｄ',
        '666按住Crtl键可以放缩画布哦o(￣▽￣)ｄ'
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