import { Rect, Transformer, Group } from 'react-konva';
import { useRef, useContext, useEffect } from 'react';
import { storeContext } from '../../stores/storeContext';
import konva from 'konva';
import Shape from './Shape';
import { observer } from "mobx-react-lite";
import { KonvaEventObject } from 'konva/lib/Node';
import isUuidV4 from '../../utils/isUuidv4';
import throttle from '../../utils/throttle';
const ActiveLayer = observer(({ scrollRef, stageRef }: { scrollRef: HTMLDivElement | null, stageRef: konva.Stage | null }) => {
    const store = useContext(storeContext);
    const transformerRef = useRef<konva.Transformer>(null);
    useEffect(() => {
        if (!transformerRef.current) return;
        const transformer = transformerRef.current;
        const handleDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
            let clientX, clientY;//获取鼠标或者触摸点的坐标
            if (e.evt.type.startsWith('mouse')) {
                // MouseEvent处理
                clientX = (e.evt as MouseEvent).clientX;
                clientY = (e.evt as MouseEvent).clientY;
            } else if (e.evt.type.startsWith('touch')) {
                // TouchEvent处理
                const touch = (e.evt as TouchEvent).changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            }
            if (scrollRef) {
                clientX = clientX as number + scrollRef?.scrollLeft;
                clientY = clientY as number + scrollRef?.scrollTop;
            }
            switch (store.boardElementStore.status) {
                case 'select':
                    e.evt.preventDefault();
                    if (e.target === transformer.getStage()) {
                        store.boardElementStore.changeActiveToStatic();
                        transformer.nodes([]);
                        store.boardElementStore.updateSelect({ x: (clientX as number), y: clientY as number });
                    } else if (e.target.id() !== "" && e.target.id() && isUuidV4(e.target.id()) && transformer.nodes().length <= 1) {//确保元素是自己生成的
                        if (store.boardElementStore.staticElement[e.target.id()]) {
                            store.boardElementStore.changeStaticToActive(e.target.id());
                        }
                        transformer.nodes([e.target]);
                        transformer.getLayer()?.batchDraw();
                    }
                    break;
                case 'move':
                    break;
            }
        }
        const handleMove = (e: MouseEvent | TouchEvent) => {
            let clientX, clientY;//获取鼠标或者触摸点的坐标
            if (e.type.startsWith('mouse')) {
                // MouseEvent处理
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            } else if (e.type.startsWith('touch')) {
                // TouchEvent处理
                const touch = (e as TouchEvent).changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            }
            if (scrollRef) {
                clientX = clientX as number + scrollRef?.scrollLeft;
                clientY = clientY as number + scrollRef?.scrollTop;
            }
            switch (store.boardElementStore.status) {
                case 'select':
                    if (store.boardElementStore.selectElement.x !== 0 && store.boardElementStore.selectElement.y !== 0) {
                        store.boardElementStore.updateSelect(undefined, { x: (clientX as number), y: clientY as number });
                    }
                    break;
                case 'move':

            }
        }
        const handleUp = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
            switch (store.boardElementStore.status) {
                case 'select':
                    if ( transformer.nodes().length === 0) {
                        const selectBox = transformer.getStage()?.find('#selectBox')[0].getClientRect();
                        const selected: konva.Node[] = [];
                        transformer.getStage()?.find('Shape').forEach((item) => {
                            if (isUuidV4(item.id()) && selectBox && konva.Util.haveIntersection(selectBox, item.getClientRect())) {
                                selected.push(item);
                            }
                        });
                        transformer.nodes(selected);
                        store.boardElementStore.updateSelect({ x: 0, y: 0 }, { x: 0, y: 0 });
                    }
                    break;
            }
        }
        if (stageRef) {
            stageRef.on('mousedown touchstart', handleDown);
            stageRef.on('mouseup touchend mouseleave', handleUp);
        }
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        return () => {
            transformer.getStage()?.off('mousedown');
            transformer.getStage()?.off('touchstart');
            transformer.getStage()?.off('mouseout');
            transformer.getStage()?.off('mouseup');
            transformer.getStage()?.off('touchend');
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);

        }
    }, [scrollRef, stageRef, store.boardElementStore]);

    const changeToAbsolute = () => {
        if (!scrollRef || !transformerRef.current || transformerRef.current.getNodes().length === 0) return;
        transformerRef.current.getNodes().forEach((item) => {
            store.boardElementStore.updateActive(item.id(), new konva.Rect().setAttrs(item.getAttrs()));
        });
    };
    const throttleChangeToAbsolute = throttle(changeToAbsolute, 100);
    return (
        <>
            {store.boardElementStore.active.length > 0 &&
                store.boardElementStore.active.map((item) =>
                    <Shape item={item} key={item[0]}></Shape>
                )
            }
            <Transformer ref={transformerRef}
                onTransformEnd={throttleChangeToAbsolute} onTransform={throttleChangeToAbsolute}
            ></Transformer>
        </>
    );
});
export default ActiveLayer;
