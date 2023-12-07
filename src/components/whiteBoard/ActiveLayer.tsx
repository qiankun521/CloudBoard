import { Rect, Transformer, Group } from 'react-konva';
import { useRef, useContext, useEffect } from 'react';
import { storeContext } from '../../stores/storeContext';
import konva from 'konva';
import Shape from './Shape';
import { observer } from "mobx-react-lite";

const ActiveLayer = observer(({ scrollRef }: { scrollRef: HTMLDivElement | null; }) => {
    const store = useContext(storeContext);
    const transformerRef = useRef<konva.Transformer>(null);
    const groupRef = useRef<konva.Group>(null);

    useEffect(() => {
        if (transformerRef.current && groupRef.current) {
            transformerRef.current.nodes([groupRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [store.boardElementStore.active]);
    const decompose_2d_matrix = (mat: number[]) => {
        let a = mat[0];
        let b = mat[1];
        let c = mat[2];
        let d = mat[3];
        let e = mat[4];
        let f = mat[5];

        let delta = a * d - b * c;

        let result = {
            translation: [e, f],
            rotation: 0,
            scale: [0, 0],
            skew: [0, 0],
        };

        if (a !== 0 || b !== 0) {
            let r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scale = [r, delta / r];
            result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
        } else if (c !== 0 || d !== 0) {
            let s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scale = [delta / s, s];
            result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
        }
        return result;
    }
    const changeToAbsolute = () => {
        if (!scrollRef || !groupRef.current) return;
        groupRef.current.getChildren().forEach((item) => {
            const id = item.id();
            const attrs = item.getAttrs();
            const absolutePosition = item.getAbsolutePosition();
            const absoluteScale = item.getAbsoluteScale();
            const absoluteRotation = item.getAbsoluteRotation();
            const result = decompose_2d_matrix(item.getAbsoluteTransform().getMatrix());
            console.log(absolutePosition, absoluteRotation, absoluteScale);
            console.log(result);
            store.boardElementStore.activeElement[id].width(attrs.width);
            store.boardElementStore.activeElement[id].height(attrs.height);
            store.boardElementStore.activeElement[id].x(absolutePosition.x + scrollRef.scrollLeft);
            store.boardElementStore.activeElement[id].y(absolutePosition.y + scrollRef.scrollTop);
            store.boardElementStore.activeElement[id].rotation(absoluteRotation);
            store.boardElementStore.activeElement[id].scale(absoluteScale);
            store.boardElementStore.activeElement[id].skewX(result.skew[0] );
            store.boardElementStore.activeElement[id].skewY(result.skew[1] );
        });
    };
    const handleTransform = () => {
        if (transformerRef.current) {
            const node = transformerRef.current.getNode();
            console.log(node);
            console.log(`New position: ${node.x()}, ${node.y()}`);
            console.log(`New size: ${node.width()}, ${node.height()}`);
            console.log(`New rotation: ${node.rotation()}`);
            console.log(`New scaleX: ${node.scaleX()}, scaleY: ${node.scaleY()}`);
        }
    };
    return (
        <>
            <Rect
                x={store.boardElementStore.selectElement.x()}
                y={store.boardElementStore.selectElement.y()}
                width={store.boardElementStore.selectElement.width()}
                height={store.boardElementStore.selectElement.height()}
                stroke='#dce8f6'
                id='select-box'
            ></Rect>
            {store.boardElementStore.active.length > 0 &&
                <Group ref={groupRef} draggable onDragEnd={changeToAbsolute} onDragStart={() => console.log('dragstart')}>
                    {store.boardElementStore.active.map((item) => <Shape item={item} key={item[0]}></Shape>
                    )}
                </Group>}
            <Transformer ref={transformerRef} onTransformEnd={changeToAbsolute} onTransform={changeToAbsolute}></Transformer>
        </>
    );
});
export default ActiveLayer;
