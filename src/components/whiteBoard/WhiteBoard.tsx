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
type Create = 'rect' | 'circle' | 'triggle';
type ActionType = 'delete' | 'select' | Create;
const WhiteBoard = observer(() => {
    const store = useContext(storeContext);
    const scrollRef = useRef<HTMLDivElement>(null);//滚动容器ref
    const stageRef = useRef<konva.Stage>(null);//舞台ref
    const activeLayerRef = useRef<konva.Layer>(null);//动态层ref
    const staticLayerRef = useRef<konva.Layer>(null);//静态层ref
    const actionType = useRef<ActionType>('select');
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
        scroll.addEventListener('scroll', handleScroll);
        return () => {
            scroll.removeEventListener('scroll', handleScroll);
        }
    }, []);
    const handleDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        switch (actionType.current) {
            case 'select':
                if (e.target === stageRef.current) {
                    store.boardElementStore.changeActiveToStatic();
                } else if (isUuidV4(e.target.id())) {//确保元素是自己生成的
                    store.boardElementStore.changeActiveToStatic(undefined, e.target.id());
                    store.boardElementStore.changeStaticToActive(e.target.id());
                }
                break;
            case 'delete':
                break;
            case 'rect':
                break;
            case 'circle':
                break;
            case 'triggle':
                break;
            default:
                break;
        }
    }
    const addStatic = () => {
        for (let i = 0; i < 100; i++) {
            const tmp = new konva.Rect();
            const id = v4();
            tmp.x(Math.random() * 10000)
            tmp.y(Math.random() * 10000)
            tmp.width(Math.random() * 100)
            tmp.height(Math.random() * 100)
            tmp.id(id);
            tmp.fill('blue');
            store.boardElementStore.addStatic(id, tmp);
        }
    }
    return (
        <main className={styles.scroll} ref={scrollRef}>
            <div className={styles.largeContainer}>
                <Stage
                    className={styles.canvas}
                    ref={stageRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={handleDown}
                    onTouchStart={handleDown}
                >
                    <Layer ref={staticLayerRef}>
                        <StaticLayer></StaticLayer>
                    </Layer>
                    <Layer ref={activeLayerRef}>
                        <ActiveLayer scrollRef={scrollRef.current}></ActiveLayer>
                    </Layer>
                </Stage>
            </div>

            <button onClick={addStatic}>添加静态</button>

        </main>
    )
})
export default WhiteBoard;
