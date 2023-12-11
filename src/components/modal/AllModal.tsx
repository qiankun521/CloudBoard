import { observer } from 'mobx-react';
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import LoginModal from './LoginModal';
import JoinModal from './JoinModal';
import ControlModal from './ControlModal';
const AllModal = observer(() => {
    const store = useContext(storeContext);
    return (
        <>
            {store.modalStore.showLoginModal &&
                <LoginModal></LoginModal>
            }
            {store.modalStore.showJoinModal &&
                <JoinModal></JoinModal>
            }
            {store.modalStore.showControlModal &&
                <ControlModal></ControlModal>
            }
        </>
    );
});
export default AllModal;