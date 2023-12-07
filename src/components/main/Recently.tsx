import styles from '../../assets/styles/Main/Recently.module.scss';
import { observer } from 'mobx-react';
import { useContext, useState } from 'react';
import { storeContext } from '../../stores/storeContext';
import { Empty } from 'antd';
import MiddleCard from './MiddleCard';
import { WhiteBoard } from '../../../global';
const Recently = observer(() => {
    const store = useContext(storeContext);
    const [menu, setMenu] = useState(1);
    return (
        <section className={styles.container}>
            <div className={styles.menu}>
                <h5
                    className={`styles.menuItem ${menu === 1 && styles.selected}`}
                    onClick={() => setMenu(1)}
                >
                    全部文件
                </h5>
                <h5 className={`styles.menuItem ${menu === 2 && styles.selected}`}
                    onClick={() => setMenu(2)}
                >
                    我的文件
                </h5>
                <h5 className={`styles.menuItem ${menu === 3 && styles.selected}`}
                    onClick={() => setMenu(3)}
                >
                    团队文件
                </h5>
            </div>
            {
                menu === 1 && (
                    store.loginRegisterStore.islogged || Object.entries(store.loginRegisterStore.whiteBoard.all as WhiteBoard).length === 0 ?
                        <Empty style={{ marginTop: '2rem' }} description='这里空空如也' /> :
                        <MiddleCard
                            {...store.loginRegisterStore.whiteBoard.all}
                        ></MiddleCard>
                )}
            {
                menu === 2 && (
                    store.loginRegisterStore.islogged || Object.entries(store.loginRegisterStore.whiteBoard.mine as WhiteBoard).length === 0 ?
                        <Empty style={{ marginTop: '2rem' }} description='这里空空如也' /> :
                        <MiddleCard
                            {...store.loginRegisterStore.whiteBoard.mine}
                        ></MiddleCard>
                )}
            {
                menu === 3 && (
                    store.loginRegisterStore.islogged || Object.entries(store.loginRegisterStore.whiteBoard.others as WhiteBoard).length === 0 ?
                        <Empty style={{ marginTop: '2rem' }} description='这里空空如也' /> :
                        <MiddleCard
                            {...store.loginRegisterStore.whiteBoard.others}
                        ></MiddleCard>
                )}

        </section>
    );
})
export default Recently;