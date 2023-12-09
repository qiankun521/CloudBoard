import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import { RxCursorArrow } from "react-icons/rx";
import { SlCursorMove } from "react-icons/sl";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import styles from '../../assets/styles/WhiteBoard/Sidebar.module.scss'
import { Popover } from "antd";
const Sidebar = observer(() => {
    const store = useContext(storeContext);
    const changeBetweenSelectAndMove = () => {
        if (store.boardElementStore.status === 'select') {
            store.boardElementStore.changeStatus('move');
        } else {
            store.boardElementStore.changeStatus('select');
        }
    }
    return (
        <>
            <aside className={styles.bottomRight}>
                <div className={`${styles.single} ${styles.active}`} onClick={changeBetweenSelectAndMove}>
                    {store.boardElementStore.status === 'select' ?
                        <Popover
                            content={
                                <div
                                    style={{
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    选择/移动
                                </div>
                            }
                        >
                            <RxCursorArrow className={styles.icon} />
                        </Popover>
                        :
                        <Popover
                            content={
                                <div
                                    style={{
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    选择/移动
                                </div>
                            }
                        >
                            <SlCursorMove className={styles.icon} />
                        </Popover>}
                </div>
                <div className={styles.single}>
                    <CiCircleMinus className={styles.icon} />
                </div>
                <div className={styles.single} style={{ fontSize: '0.8rem' }}>
                    100%
                </div>
                <div className={styles.single}>
                    <CiCirclePlus className={styles.icon} />
                </div>
            </aside>
        </>
    )
});
export default Sidebar;