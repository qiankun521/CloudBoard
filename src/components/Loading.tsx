import styles from '../assets/styles/Loading.module.scss';
import { useState, useContext,useEffect } from 'react';
import { observer } from "mobx-react-lite";
import {Spin} from 'antd';
import { storeContext } from '../stores/storeContext';

const Loading = observer(() => {
    const [tip, setTip] = useState('正在努力加载中...');
    const tips = useContext(storeContext).tipsStore.tips;
    useEffect(() => {
        const interval = setInterval(() => {
            setTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 3000);
        return () => {
            clearInterval(interval);
        }
    }, [tips]);
    return (
        <section className={styles.container}>
            <Spin size='large'></Spin>
            <p>{tip}</p>
        </section>
    )
})
export default Loading;