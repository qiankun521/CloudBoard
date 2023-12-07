import styles from '../assets/styles/Main/Head.module.scss'
import { Avatar, Button } from 'antd';
import { observer } from 'mobx-react';
import { storeContext } from '../stores/storeContext';
import { useContext } from 'react';
import { AiOutlineUser, AiOutlineHdd, AiOutlineDownload } from "react-icons/ai";
const MainHead = observer(({ title }: { title: string }) => {
    const store = useContext(storeContext);
    return (
        <>
            <div className={styles.top}>
                <div className={styles.left}>
                    <h1>{title}</h1>
                </div>
                <div className={styles.right}>
                    {
                        store.loginRegisterStore.islogged ?
                            <Avatar icon={<AiOutlineUser></AiOutlineUser>}></Avatar> :
                            <Button type='primary' className={styles.loginButton}>登录/注册</Button>
                    }
                    <Button className={styles.normalButton}>
                        <div className={styles.icon}>
                            <AiOutlineDownload style={{ fontSize: '1rem', verticalAlign: 'center' }}></AiOutlineDownload>
                            下载客户端
                        </div>
                    </Button>
                    <Button className={styles.normalButton}>
                        <div className={styles.icon}>
                            <AiOutlineHdd style={{ fontSize: '1rem', verticalAlign: 'center' }}></AiOutlineHdd>
                            通过共享码加入白板
                        </div>
                    </Button>
                </div>
            </div>
        </>

    )
});
export default MainHead;
