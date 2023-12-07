import { Store } from './index';
import { makeAutoObservable } from 'mobx';
class ModalStore {
    rootStore: Store
    showLoginModal: boolean = false;
    showSearchModal: boolean = false;
    constructor(rootStore: Store) {
        makeAutoObservable(this);
        this.rootStore = rootStore
    }
    setShowLoginModal(value: boolean) {
        this.showLoginModal = value;
    }
    setShowSearchModal(value: boolean) {
        this.showSearchModal = value;
    }
}
export default ModalStore;