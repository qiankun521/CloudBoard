import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { storeContext } from '../../stores/storeContext';
import { RxCursorArrow } from "react-icons/rx";
import { SlCursorMove } from "react-icons/sl";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { IoPricetag, IoRemoveOutline } from "react-icons/io5";
import { CiText } from "react-icons/ci";
import { SiWire } from "react-icons/si";
import { RiArrowGoBackFill, RiArrowGoForwardFill } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import { SlPicture } from "react-icons/sl";
import { IoIosCloudOutline } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { PiMicrophoneStage } from "react-icons/pi";
import { IoPersonAddOutline } from "react-icons/io5";
import styles from '../../assets/styles/WhiteBoard/Sidebar.module.scss'
import { Avatar, Button, Popover, message } from "antd";
import konva from 'konva';
import download from 'downloadjs';
import { Status } from "../../../global";
const Sidebar = observer(({ scrollRef, stageRef }: { scrollRef: HTMLDivElement | null, stageRef: konva.Stage | null }) => {
    const store = useContext(storeContext);
    const [select, setSelect] = useState<Status>(store.boardElementStore.status);
    const navigate = useNavigate();
    const changeBetweenSelectAndMove = () => {
        if (store.boardElementStore.status === 'select') {
            store.boardElementStore.updateSelect({ x: 0, y: 0 }, { x: 0, y: 0 });
            store.boardElementStore.updateCreate({ x: 0, y: 0 }, { x: 0, y: 0 });
            store.boardElementStore.changeStatus('move');
            setSelect('move');
        } else if (store.boardElementStore.status === 'move') {
            store.boardElementStore.updateSelect({ x: 0, y: 0 }, { x: 0, y: 0 });
            store.boardElementStore.updateCreate({ x: 0, y: 0 }, { x: 0, y: 0 });
            store.boardElementStore.changeStatus('select');
            setSelect('select');
        } else {
            store.boardElementStore.changeStatus('move');
            store.boardElementStore.updateCreate({ x: 0, y: 0 }, { x: 0, y: 0 });
            store.boardElementStore.updateSelect({ x: 0, y: 0 }, { x: 0, y: 0 });
            setSelect('move');
        }
    }
    const handleStageScaleGrow = () => {
        if (!stageRef || stageRef?.scaleX() >= 2 || stageRef?.scaleY() >= 2) return;
        stageRef?.scaleX(stageRef?.scaleX() + 0.01);
        stageRef?.scaleY(stageRef?.scaleY() + 0.01);
        store.boardElementStore.updateScale(stageRef?.scaleX() + 0.01 as number, stageRef?.scaleY() + 0.01 as number);
    }
    const handleStageScaleShrink = () => {
        if (!stageRef || stageRef?.scaleX() <= 0.1 || stageRef?.scaleY() <= 0.1) return;
        stageRef?.scaleX(stageRef?.scaleX() - 0.01);
        stageRef?.scaleY(stageRef?.scaleY() - 0.01);
        store.boardElementStore.updateScale(stageRef?.scaleX() - 0.01 as number, stageRef?.scaleY() - 0.01 as number);
    }
    const handleDownloadJson = () => {
        if (!stageRef) {
            message.error('下载失败');
            return;
        }
        const json = stageRef.toJSON();
        download(JSON.stringify(json), 'whiteBoard.json', 'text/json');
    }
    const handleDownloadImage = () => {
        if (!stageRef) {
            message.error('下载失败');
            return;
        }
        const dataURL = stageRef.toDataURL();
        download(dataURL, 'whiteBoard.png', 'image/png');
    }
    return (
        <>
            <aside className={styles.bottomRight}>
                <div className={`${styles.single} ${(select === 'select' || select === 'move') && styles.active}`} onClick={changeBetweenSelectAndMove}>
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
                <div className={styles.single} onClick={handleStageScaleShrink}>
                    <CiCircleMinus className={styles.icon} />
                </div>
                <div className={styles.single} style={{ fontSize: '0.8rem' }}>
                    {store.boardElementStore.scaleX * 100}%
                </div>
                <div className={styles.single} onClick={handleStageScaleGrow}>
                    <CiCirclePlus className={styles.icon} />
                </div>
            </aside>
            <aside className={styles.left}>
                <div
                    className={`${styles.single} ${select === 'rect' && styles.active}`}
                    onClick={() => {
                        setSelect('rect');
                        store.boardElementStore.changeStatus('rect');

                    }}
                >
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                矩形
                            </div>
                        }
                        placement="right"
                    >
                        <LuRectangleHorizontal className={styles.icon} />
                    </Popover>
                </div>
                <div
                    className={`${styles.single} ${select === 'circle' && styles.active}`}
                    onClick={() => {
                        setSelect('circle');
                        store.boardElementStore.changeStatus('circle');
                    }}
                >
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                圆形
                            </div>
                        }
                        placement="right"
                    >
                        <FaRegCircle className={styles.icon} />
                    </Popover>
                </div>
                <div
                    className={`${styles.single} ${select === 'line' && styles.active}`}
                    onClick={() => {
                        setSelect('line');
                        store.boardElementStore.changeStatus('line');
                    }}
                >
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                直线
                            </div>
                        }
                        placement="right"
                    >
                        <IoRemoveOutline className={styles.icon} />
                    </Popover>
                </div>
                <div
                    className={`${styles.single} ${select === 'Spline' && styles.active}`}
                    onClick={() => {
                        setSelect('Spline');
                        store.boardElementStore.changeStatus('Spline');
                    }}
                >
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                曲线
                            </div>
                        }
                        placement="right"
                    >
                        <SiWire className={styles.icon} />
                    </Popover>
                </div>
                <div
                    className={`${styles.single} ${select === 'text' && styles.active}`}
                    onClick={() => {
                        setSelect('text');
                        store.boardElementStore.changeStatus('text');
                    }}
                >
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                文字
                            </div>
                        }
                        placement="right"
                    >
                        <CiText className={styles.icon} />
                    </Popover>
                </div>
            </aside>
            <aside className={styles.bottomLeft}>
                <div className={`${styles.single}`}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                回退
                            </div>
                        }
                        placement="top"
                    >
                        <RiArrowGoBackFill className={styles.icon} />
                    </Popover>
                </div>
                <div className={styles.single}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                前进
                            </div>
                        }
                        placement="top"
                    >
                        <RiArrowGoForwardFill className={styles.icon} />
                    </Popover>
                </div>
            </aside>
            <aside className={styles.topLeft}>
                <div className={styles.single} onClick={() => navigate('/home')}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                返回主界面
                            </div>
                        }
                        placement="bottom"
                    >
                        <IoIosArrowBack className={styles.icon} />
                    </Popover>
                </div>
                <div className={styles.text}>
                    白板名字
                </div>
                <div className={styles.single} onClick={handleDownloadJson}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                导出配置
                            </div>
                        }
                        placement="bottom"
                    >
                        <GoDownload className={styles.icon} />
                    </Popover>

                </div>
                <div className={styles.single} onClick={handleDownloadImage}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                导出图片
                            </div>
                        }
                        placement="bottom"
                    >
                        <SlPicture className={styles.icon} />
                    </Popover>
                </div>
                <div className={styles.single}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                云端保存
                            </div>
                        }
                        placement="bottom"
                    >
                        <IoIosCloudOutline className={styles.icon} />
                    </Popover>
                </div>
            </aside>
            <aside className={styles.topRight}>
                <div className={styles.single}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                聊天
                            </div>
                        }
                        placement="bottom"
                    >
                        <IoChatboxOutline className={styles.icon} />
                    </Popover>
                </div>
                <div className={styles.single}>
                    <Popover
                        content={
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                            >
                                模式
                            </div>
                        }
                        placement="bottom"
                    >
                        <PiMicrophoneStage className={styles.icon} />
                    </Popover>
                </div>
                <div className={styles.text}>
                    <Avatar
                        style={{ padding: '0' }}
                    ></Avatar>
                </div>
                <div className={styles.button}>
                    <div className={styles.icon}>
                        <div><IoPersonAddOutline /></div>
                        <p>共享</p>
                    </div>

                </div>
            </aside>

        </>
    )
});
export default Sidebar;