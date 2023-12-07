import styles from '../assets/styles/WhiteBoardPage.module.scss';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import Loading from './Loading';
import WhiteBoard from './whiteBoard/WhiteBoard';
const WhiteBoardPage = observer(() => {
    const [loaded, setLoaded] = useState(false);
    const boardId = useParams<{ id: string }>().id;
    useEffect(() => {
        setTimeout(()=>{
            setLoaded(true);
        },500);
    }, [boardId]);
    if (!loaded) return (
        <Loading></Loading>
    )
    else return (
        <WhiteBoard></WhiteBoard>
    )
})
export default WhiteBoardPage;