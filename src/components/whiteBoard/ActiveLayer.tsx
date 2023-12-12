import { Rect, Transformer, Group } from 'react-konva';
import { useRef, useContext, useEffect } from 'react';
import { storeContext } from '../../stores/storeContext';
import konva from 'konva';
import Shape from './Shape';
import { observer } from "mobx-react-lite";
import { KonvaEventObject } from 'konva/lib/Node';
import { Text } from 'react-konva';
import isUuidV4 from '../../utils/isUuidv4';
import throttle from '../../utils/throttle';
import { v4 } from 'uuid';
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
                clientX = (clientX as number + scrollRef?.scrollLeft) * store.boardElementStore.scaleX;
                clientY = (clientY as number + scrollRef?.scrollTop) * store.boardElementStore.scaleY;
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
                    if (e.target === transformer.getStage()) {
                        store.boardElementStore.changeActiveToStatic();
                        transformer.nodes([]);
                        store.boardElementStore.updateSelect({ x: (clientX as number), y: clientY as number });
                        store.boardElementStore.moveFlag = true;
                    }
                    break;
                case 'rect':
                    e.evt.preventDefault();
                    store.boardElementStore.updateCreate({ x: (clientX as number), y: clientY as number });
                    break;
                case 'circle':
                    e.evt.preventDefault();
                    store.boardElementStore.updateCreate({ x: (clientX as number), y: clientY as number });
                    break;
                case 'line':
                    e.evt.preventDefault();
                    store.boardElementStore.updateCreate({ x: (clientX as number), y: clientY as number });
                    break;
                case 'Spline':
                    e.evt.preventDefault();
                    store.boardElementStore.updateCreateAdvanced([clientX as number, clientY as number]);
                    store.boardElementStore.createFlag = true;
                    break;

            }
        }
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (store.boardElementStore.status === 'move' && !store.boardElementStore.moveFlag) return;
            if (store.boardElementStore.status === 'Spline' && !store.boardElementStore.createFlag) return;
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
                        store.boardElementStore.updateSelect(undefined, { x: clientX as number, y: clientY as number });
                    }
                    break;
                case 'move':
                    if (scrollRef && store.boardElementStore.selectElement.x !== 0 && store.boardElementStore.selectElement.y !== 0) {
                        scrollRef.scrollTop -= ((clientY as number) - store.boardElementStore.selectElement.y) / 1.5;
                        scrollRef.scrollLeft -= ((clientX as number) - store.boardElementStore.selectElement.x) / 1.5;
                        store.boardElementStore.updateSelect({ x: clientX as number, y: clientY as number });
                    }
                    break;
                case 'rect':
                    if (store.boardElementStore.createElement.lastX !== 0 && store.boardElementStore.createElement.lastY !== 0) {
                        store.boardElementStore.updateCreate(undefined, { x: clientX as number, y: clientY as number });
                    }
                    break;
                case 'circle':
                    if (store.boardElementStore.createElement.lastX !== 0 && store.boardElementStore.createElement.lastY !== 0) {
                        store.boardElementStore.updateCreate(undefined, { x: clientX as number, y: clientY as number });
                    }
                    break;
                case 'line':
                    if (store.boardElementStore.createElement.lastX !== 0 && store.boardElementStore.createElement.lastY !== 0) {
                        store.boardElementStore.updateCreate(undefined, { x: clientX as number, y: clientY as number });
                    }
                    break;
                case 'Spline':
                    const tmp = store.boardElementStore.createAdvancedElement;
                    if (Math.abs((clientX as number) - tmp[tmp.length - 2]) + Math.abs((clientY as number) - tmp[tmp.length - 1]) > 3) {
                        store.boardElementStore.updateCreateAdvanced([clientX as number, clientY as number]);
                    }
                    break;

            }
        }
        const throttleHandleMove = throttle(handleMove, 30);
        const handleUp = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
            switch (store.boardElementStore.status) {
                case 'select':
                    if (transformer.nodes().length === 0) {
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
                case 'move':
                    store.boardElementStore.moveFlag = false;
                    break;
                case 'rect':
                    const id = v4();
                    const rect = new konva.Rect({
                        x: store.boardElementStore.createElement.lastX,
                        y: store.boardElementStore.createElement.lastY,
                        width: store.boardElementStore.createElement.x - store.boardElementStore.createElement.lastX,
                        height: store.boardElementStore.createElement.y - store.boardElementStore.createElement.lastY,
                        id: id,
                        stroke: 'black',
                        draggable: true
                    });
                    store.boardElementStore.updateCreate();
                    if (Math.abs(rect.width()) === Math.abs(rect.x()) || Math.abs(rect.y()) === Math.abs(rect.height()) || Math.abs(rect.width()) <= 1 || Math.abs(rect.height()) <= 1) {
                        return;
                    }
                    store.boardElementStore.updateCreate();
                    store.boardElementStore.addStatic(id, rect);
                    store.boardElementStore.changeStaticToActive(id);
                    transformer.nodes([rect]);
                    store.boardElementStore.undoRedoStack.push({
                        type: 'create',
                        id: id,
                        element: store.boardElementStore.activeElement[id].clone()
                    })
                    break;
                case 'circle':
                    const circleId = v4();
                    const circle = new konva.Circle({
                        x: store.boardElementStore.createElement.lastX,
                        y: store.boardElementStore.createElement.lastY,
                        radius: Math.sqrt(Math.pow(store.boardElementStore.createElement.lastX - store.boardElementStore.createElement.x, 2) + Math.pow(store.boardElementStore.createElement.lastY - store.boardElementStore.createElement.y, 2)),
                        id: circleId,
                        stroke: 'black',
                        draggable: true
                    });
                    if (circle.radius() <= 1 || store.boardElementStore.createElement.y === 0 || store.boardElementStore.createElement.x === 0) {
                        store.boardElementStore.updateCreate();
                        return;
                    }
                    store.boardElementStore.updateCreate();
                    store.boardElementStore.addStatic(circleId, circle);
                    store.boardElementStore.changeStaticToActive(circleId);
                    transformer.nodes([circle]);
                    store.boardElementStore.undoRedoStack.push({
                        type: 'create',
                        id: circleId,
                        element: store.boardElementStore.activeElement[circleId].clone()
                    })
                    break;
                case 'line':
                    const lineId = v4();
                    const line = new konva.Line({
                        points: [store.boardElementStore.createElement.lastX, store.boardElementStore.createElement.lastY, store.boardElementStore.createElement.x, store.boardElementStore.createElement.y],
                        id: lineId,
                        stroke: 'black',
                        hitStrokeWidth: 20,
                        draggable: true
                    });
                    store.boardElementStore.updateCreate();
                    if (line.points()[2] === 0 || Math.abs(line.points()[0] - line.points()[2]) < 1 || Math.abs(line.points()[1] - line.points()[3]) < 1) return;
                    store.boardElementStore.addStatic(lineId, line);
                    store.boardElementStore.changeStaticToActive(lineId);
                    transformer.nodes([line]);
                    store.boardElementStore.undoRedoStack.push({
                        type: 'create',
                        id: lineId,
                        element: store.boardElementStore.activeElement[lineId].clone()
                    })
                    break;
                case 'Spline':
                    store.boardElementStore.createFlag = false;
                    const splineId = v4();
                    const spline = new konva.Line({
                        points: [...store.boardElementStore.createAdvancedElement],
                        id: splineId,
                        stroke: 'black',
                        hitStrokeWidth: 20,
                        draggable: true,
                        tension: 0.5,
                        lineCap: 'round',
                        lineJoin: 'round',
                        pointerLength: 10,
                        pointerWidth: 10
                    });
                    store.boardElementStore.updateCreateAdvanced();
                    if (spline.points().length < 4) return;
                    store.boardElementStore.addStatic(splineId, spline);
                    store.boardElementStore.changeStaticToActive(splineId);
                    transformer.nodes([spline]);
                    store.boardElementStore.undoRedoStack.push({
                        type: 'create',
                        id: splineId,
                        element: store.boardElementStore.activeElement[splineId].clone()
                    })
                    break;
            }
        }
        if (stageRef) {
            stageRef.on('mousedown touchstart', handleDown);
            stageRef.on('mouseup touchend mouseleave', handleUp);
        }
        window.addEventListener('mousemove', throttleHandleMove);
        window.addEventListener('touchmove', throttleHandleMove);
        return () => {
            transformer.getStage()?.off('mousedown');
            transformer.getStage()?.off('touchstart');
            transformer.getStage()?.off('mouseleave');
            transformer.getStage()?.off('mouseup');
            transformer.getStage()?.off('touchend');
            window.removeEventListener('mousemove', throttleHandleMove);
            window.removeEventListener('touchmove', throttleHandleMove);
        }
    }, [scrollRef, stageRef, store.boardElementStore]);

    const changeToAbsolute = () => {
        if (!scrollRef || !transformerRef.current || transformerRef.current.getNodes().length === 0) return;
        transformerRef.current.getNodes().forEach((item) => {
            switch (item.getClassName()) {
                case 'Rect':
                    store.boardElementStore.updateActive(item.id(), new konva.Rect().setAttrs(item.getAttrs()));
                    break;
                case 'Circle':
                    store.boardElementStore.updateActive(item.id(), new konva.Circle().setAttrs(item.getAttrs()));
                    break;
                case 'Line':
                    store.boardElementStore.updateActive(item.id(), new konva.Line().setAttrs(item.getAttrs()));
                    break;
            }
            store.boardElementStore.undoRedoStack.push({
                type: 'update',
                id: item.id(),
                element: store.boardElementStore.staticElement[item.id()]
            })
        });
    };
    const throttleChangeToAbsolute = throttle(changeToAbsolute, 200);
    return (
        <>
            {store.boardElementStore.active.length > 0 &&
                store.boardElementStore.active.map((item) =>
                    <Shape item={item} key={item[0]}></Shape>
                )
            }
            <Text
                x={5000}
                y={5000}
                text='中央'
                draggable
            ></Text>
            <Transformer ref={transformerRef}
                onTransformEnd={throttleChangeToAbsolute}
            ></Transformer>
        </>
    );
});
export default ActiveLayer;
