import styles from '../assets/styles/WhiteBoardPage.module.scss';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import Loading from './Loading';
import WhiteBoard from './whiteBoard/WhiteBoard';
const WhiteBoardPage = observer(() => {
    const [loaded, setLoaded] = useState(false);
    const boardId = useParams<{ id: string }>().id;//白板id
    const searchParams = useLocation().search;
    const params = new URLSearchParams(searchParams).get('invite');//邀请码
    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 2000);
        //ws连接
    }, [boardId]);
    if (!loaded) return (
        <Loading></Loading>
    )
    else return (
        <WhiteBoard></WhiteBoard>
    )
})
export default WhiteBoardPage;