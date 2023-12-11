import styles from '../../assets/styles/Main/Main.module.scss';
import { Avatar, Button, Input, message } from 'antd';
import { observer } from 'mobx-react';
import { storeContext } from '../../stores/storeContext';
import { useContext, useState } from 'react';
import { AiOutlineUser, AiOutlineHdd, AiOutlineDownload, AiOutlineSearch } from "react-icons/ai";
import { GiHiveMind } from "react-icons/gi";
import { RiMindMap } from "react-icons/ri";
import { LuWorkflow } from "react-icons/lu";
import { MouseEvent } from 'react';
import LittleCard from './LittleCard';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import Recently from './Recently';
import { create } from 'domain';
const Main = observer(() => {
    const store = useContext(storeContext);
    const [classify, setClassify] = useState(1);
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();//搜索modal
    }
    const handleLogin = (e: MouseEvent) => {
        e.preventDefault();
        store.modalStore.setShowLoginModal(true);
    }
    const handleJoin = (e: MouseEvent) => {
        e.preventDefault();
        if (!store.loginRegisterStore.islogged) {
            store.modalStore.setShowLoginModal(true);
            message.error('请先登录');
            return;
        }
        store.modalStore.setShowJoinModal(true);
    }
    return (
        <main className={styles.container}>
            <div className={styles.top}>
                <div className={styles.left}>
                    <h1>首页</h1>
                </div>
                <div className={styles.right}>
                    {
                        store.loginRegisterStore.islogged ?
                            <Avatar icon={<AiOutlineUser></AiOutlineUser>} onClick={() => store.loginRegisterStore.logout()}></Avatar> :
                            <Button type='primary' className={styles.loginButton} onClick={handleLogin}>登录/注册</Button>
                    }
                    <Button className={styles.normalButton}>
                        <div className={styles.icon}>
                            <AiOutlineDownload style={{ fontSize: '1rem', verticalAlign: 'center' }}></AiOutlineDownload>
                            <div className={styles.title}>下载客户端</div>
                            <div className={styles.shortTitle}>下载</div>
                        </div>
                    </Button>
                    <Button className={styles.normalButton} onClick={handleJoin}>
                        <div className={styles.icon}>
                            <AiOutlineHdd style={{ fontSize: '1rem' }}></AiOutlineHdd>
                            <div className={styles.title}>通过共享链接加入白板</div>
                            <div className={styles.shortTitle}>加入</div>
                        </div>
                    </Button>
                </div>
            </div>
            <div className={styles.searchContainer}>
                <div className={styles.search}>
                    <div className={styles.searchTop}>
                        <Input
                            size='middle'
                            placeholder='搜索文件、模板'
                            className={styles.searchBox}
                            prefix={<AiOutlineSearch style={{ fontSize: '1rem' }}></AiOutlineSearch>}
                            onClick={handleClick}
                        ></Input>
                    </div>
                    <div className={styles.searchBottom}>
                        <div className={styles.short} onClick={() => setClassify(1)}>
                            <Avatar
                                className={styles.shortAvatar1}
                                icon={<GiHiveMind></GiHiveMind>}
                                style={{ backgroundColor: classify === 1 ? '#ff75e8' : '#fff', color: '#000' }}
                                size={46}
                            ></Avatar>
                            <p>协同白板</p>
                        </div>
                        <div className={styles.short} onClick={() => setClassify(2)}>
                            <Avatar
                                className={styles.shortAvatar2}
                                icon={<RiMindMap></RiMindMap>}
                                style={{ backgroundColor: classify === 2 ? '#ff7487' : '#fff', color: '#000' }}
                                size={46}
                            ></Avatar>
                            <p>思维导图</p>
                        </div>
                        <div className={styles.short} onClick={() => setClassify(3)}>
                            <Avatar
                                className={styles.shortAvatar3}
                                icon={<LuWorkflow></LuWorkflow>}
                                style={{ backgroundColor: classify === 3 ? '#ffac2f' : '#fff', color: '#000' }}
                                size={46}
                            ></Avatar>
                            <p>流程图</p>
                        </div>
                        <div className={styles.short} onClick={() => setClassify(4)}>
                            <Avatar
                                className={styles.shortAvatar3}
                                icon={<IoChatboxEllipsesOutline></IoChatboxEllipsesOutline>}
                                style={{ backgroundColor: classify === 4 ? '#19dea6' : '#fff', color: '#000' }}
                                size={46}
                            ></Avatar>
                            <p>流程图</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.createWhiteBoard}>
                <div className={styles.description}>
                    <h5>快速新建</h5>
                </div>
                <div className={styles.descriptionCardContainer}>
                    <LittleCard
                        src="https://cdn.boardmix.cn/app/images/scenecut/scene-create.png"
                        description="创建白板"
                        type='new'
                    ></LittleCard>
                    <LittleCard
                        src='https://cdn.boardmix.cn/app/images/scenecut/board-mindmap.png'
                        description="思维导图"
                        type='templete'
                    ></LittleCard>
                    <LittleCard
                        src='https://cdn.boardmix.cn/app/images/scenecut/board-flow.png'
                        description="流程图"
                        type='templete'
                    ></LittleCard>
                    <LittleCard
                        src='https://cdn.boardmix.cn/app/images/scenecut/board-flow.png'
                        description="流程图"
                        type='templete'
                    ></LittleCard>
                    <LittleCard
                        src='https://cdn.boardmix.cn/app/images/scenecut/board-flow.png'
                        description="流程图"
                        type='templete'
                    ></LittleCard>
                    <LittleCard
                        src='https://cdn.boardmix.cn/app/images/scenecut/board-flow.png'
                        description="流程图"
                        type='templete'
                    ></LittleCard>
                    <LittleCard
                        src='https://cdn.boardmix.cn/app/images/scenecut/board-flow.png'
                        description="流程图"
                        type='templete'
                    ></LittleCard>
                </div>
            </div>
            <div className={styles.recently}>
                <div className={styles.description}>
                    <h5>最近打开</h5>
                </div>
                <Recently></Recently>
            </div>
            <div className={styles.collection}>

            </div>
        </main>
    )
})
export default Main;