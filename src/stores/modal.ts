import { Store } from './index';
import { makeAutoObservable } from 'mobx';
class ModalStore {
    rootStore: Store
    showLoginModal: boolean = false;
    showSearchModal: boolean = false;
    showJoinModal: boolean = false;
    showControlModal: boolean = false;
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
    setShowJoinModal(value: boolean) {
        this.showJoinModal = value;
    }
    setShowControlModal(value: boolean) {
        this.showControlModal = value;
    }
}
export default ModalStore;