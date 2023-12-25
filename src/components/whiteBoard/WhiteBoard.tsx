import { KonvaEventObject } from 'konva/lib/Node';
import styles from '../../assets/styles/WhiteBoard/WhiteBoard.module.scss';
import { useEffect, useRef, useState, useContext } from 'react';
import { Rect, Stage, Layer, Transformer, Shape } from 'react-konva';
import konva from 'konva';
import StaticLayer from './StaticLayer';
import { storeContext } from '../../stores/storeContext';
import ActiveLayer from './ActiveLayer';
import { v4 } from 'uuid';
import { observer } from "mobx-react-lite"
import isUuidV4 from '../../utils/isUuidv4';
import TopLayer from './TopLayer';
import Sidebar from './Sidebar';
const WhiteBoard = observer(() => {
    const store = useContext(storeContext);
    const scrollRef = useRef<HTMLDivElement>(null);//滚动容器ref
    const stageRef = useRef<konva.Stage>(null);//舞台ref
    const activeLayerRef = useRef<konva.Layer>(null);//动态层ref
    const staticLayerRef = useRef<konva.Layer>(null);//静态层ref
    const handleScroll = () => {
        if (scrollRef.current && stageRef.current) {
            const dx = scrollRef.current.scrollLeft;
            const dy = scrollRef.current.scrollTop;
            stageRef.current.container().style.transform = 'translate(' + scrollRef.current.scrollLeft + 'px,' + scrollRef.current.scrollTop + 'px)';
            stageRef.current.x(-dx);
            stageRef.current.y(-dy);
            stageRef.current.batchDraw();
        }
    };
    useEffect(() => {
        if (!scrollRef.current || !stageRef.current) return;
        let scroll = scrollRef.current;
        scroll.scrollLeft = 5000;
        scroll.scrollTop = 5000;
        scroll.addEventListener('scroll', handleScroll);
        return () => {
            scroll.removeEventListener('scroll', handleScroll);
        }
    }, []);
    return (
        <main className={styles.scroll} ref={scrollRef}>
            <div className={styles.largeContainer}>
                <Stage
                    className={styles.canvas}
                    ref={stageRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                >
                    <TopLayer></TopLayer>
                    <Layer ref={staticLayerRef}>
                        <StaticLayer></StaticLayer>
                    </Layer>
                    <Layer ref={activeLayerRef}>
                        <ActiveLayer scrollRef={scrollRef} stageRef={stageRef}></ActiveLayer>
                    </Layer>
                </Stage>
            </div>
            <Sidebar scrollRef={scrollRef.current} stageRef={stageRef}></Sidebar>
        </main>
    )
})
export default WhiteBoard;
