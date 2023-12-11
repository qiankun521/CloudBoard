import styles from '../../assets/styles/Modal/JoinModal.module.scss';
import {  Input, Button} from 'antd';
import { useState, useEffect, useRef, useContext } from 'react';
import { observer } from 'mobx-react';
import { storeContext } from '../../stores/storeContext';
import { useNavigate } from 'react-router-dom';
const JoinModal = observer(() => {
    const store = useContext(storeContext);
    const containRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            e.stopPropagation();
            if (containRef.current && containRef.current === e.target) {
                store.modalStore.setShowJoinModal(false);
            }
        }
        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [store.modalStore])
    const handleClick = () => {
        if (value === '') return;
        store.modalStore.setShowJoinModal(false);
        navigate(`/whiteboard/${value}`);
    }
    return (
        <section className={styles.container} ref={containRef}>
            <div className={styles.joinBox}>
                <p>加入白板</p>
                <div className={styles.description}>
                    <h3>如何获取共享链接？</h3>
                    <h3 className={styles.light}>联系白板文件的所有者，通过白板界面的右上角分享按钮获取共享链接</h3>
                </div>
                <div className={styles.input}>
                    <Input onChange={(e) => setValue(e.target.value)}></Input>
                    <Button onClick={handleClick}>加入</Button>
                </div>

            </div>
        </section>
    )
});
export default JoinModal;