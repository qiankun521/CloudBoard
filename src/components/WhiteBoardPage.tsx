import styles from '../assets/styles/WhiteBoardPage.module.scss';
import { useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { storeContext } from '../stores/storeContext';
import Loading from './Loading';
import WhiteBoard from './whiteBoard/WhiteBoard';
import isUuidV4 from '../utils/isUuidv4';
import { message } from 'antd';
const WhiteBoardPage = observer(() => {
    const store = useContext(storeContext);
    const boardId = useParams<{ id: string }>().id;//白板id
    const searchParams = useLocation().search;
    const navigate = useNavigate();
    const params = new URLSearchParams(searchParams).get('invite');//邀请码
    useEffect(() => {
        if (!store.loginRegisterStore.islogged || store.websocketStore.isconnected) {
            navigate('/home');
        }
        else {
            if (boardId && isUuidV4(boardId)) {
                let flag = false;
                let id: string;
                for (const single of store.loginRegisterStore.whiteBoard.all) {
                    if (single.uuid === boardId) {
                        flag = true;
                        if (single.roomId) id = single.roomId;
                        else if (single.id) id = single.id;
                        break;
                    }
                }
                if (flag) {
                    store.websocketStore.connect(id!);
                } else {
                    store.loginRegisterStore.joinWhiteBoard(boardId)?.then((id) => {
                        if (id) {
                            store.websocketStore.connect(id);
                            store.boardElementStore.reset();
                        } else {
                            navigate('/home');
                        }
                    })
                }
            } else {
                message.error('白板共享地址错误');
                navigate('/home');
            }
        }
        return () => {
            store.websocketStore.close();
            store.boardElementStore.reset();
        }
    }, [boardId, navigate, store.boardElementStore, store.loginRegisterStore, store.loginRegisterStore.islogged, store.loginRegisterStore.whiteBoard.all, store.websocketStore]);
    if (store.websocketStore.messages.length === 0) return (
        <Loading></Loading>
    )
    else return (
        <WhiteBoard></WhiteBoard>
    )
})
export default WhiteBoardPage;