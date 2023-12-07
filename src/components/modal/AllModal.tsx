import { observer } from 'mobx-react';
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import LoginModal from './LoginModal';
const AllModal = observer(() => {
    const store = useContext(storeContext);
    return (
        <>
            {store.modalStore.showLoginModal &&
                <LoginModal></LoginModal>
            }
        </>
    );
});
export default AllModal;