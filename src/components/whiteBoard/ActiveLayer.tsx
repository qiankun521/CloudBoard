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
        if (stageRef)
            stageRef.on('mousedown', (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
                if (e.target === transformer.getStage()) {
                    store.boardElementStore.changeActiveToStatic();
                    transformer.nodes([]);
                } else if (e.target.id() !== "" && e.target.id() && isUuidV4(e.target.id())) {//确保元素是自己生成的
                    if (store.boardElementStore.staticElement[e.target.id()]) {
                        store.boardElementStore.changeStaticToActive(e.target.id());
                    }
                    transformer.nodes([e.target]);
                    transformer.getLayer()?.batchDraw();
                    console.log(transformer.getNodes());
                }
            });
        return () => {
            transformer.getStage()?.off('mousedown');
        }
    }, [stageRef, store.boardElementStore]);

    const changeToAbsolute = () => {
        if (!scrollRef || !transformerRef.current || transformerRef.current.getNodes().length === 0) return;
        transformerRef.current.getNodes().forEach((item) => {
            store.boardElementStore.updateActive(item.id(), new konva.Rect().setAttrs(item.getAttrs()));
        });
    };
    const throttleChangeToAbsolute = throttle(changeToAbsolute, 100);
    return (
        <>
            <Rect
                x={store.boardElementStore.selectElement.x()}
                y={store.boardElementStore.selectElement.y()}
                width={store.boardElementStore.selectElement.width()}
                height={store.boardElementStore.selectElement.height()}
                fill='rgba(0,0,0,0)'
                stroke='black'
                strokeWidth={1}
            ></Rect>
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
