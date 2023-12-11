import styles from '../assets/styles/Loading.module.scss';
import { useState, useContext, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Spin } from 'antd';
import { storeContext } from '../stores/storeContext';

const Loading = observer(() => {
    const tips = useContext(storeContext).tipsStore.tips;
    const [tip, setTip] = useState(tips[Math.floor(Math.random() * tips.length)]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 1500);
        return () => {
            clearInterval(interval);
        }
    }, [tips]);
    return (
        <section className={styles.container}>
            <Spin size='large'></Spin>
            <p>{tip}</p>
            <div className={`${styles.topLeft}`}></div>
            <div className={`${styles.topRight}`}></div>
            <div className={`${styles.bottomRight}`}></div>
            <div className={`${styles.bottomLeft}`}></div>
            <div className={`${styles.left}`}></div>
        </section>
    )
})
export default Loading;