import konva from 'konva';
import { Rect, Circle, Line } from 'react-konva';
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import throttle from '../../utils/throttle';
const Shape = observer(({ item }: { item: [string, konva.Shape] }) => {
    let element;
    const store = useContext(storeContext);
    const handleMove = (e: konva.KonvaEventObject<DragEvent>) => {
        switch (e.target.getClassName()) {
            case 'Rect':
                store.boardElementStore.updateActive(e.target.id(), new konva.Rect(e.target.attrs));
                break;
            case 'Circle':
                store.boardElementStore.updateActive(e.target.id(), new konva.Circle(e.target.attrs));
                break;
            case 'Line':
                store.boardElementStore.updateActive(e.target.id(), new konva.Line(e.target.attrs));
                break;
        }
    }
    const throttleHandleMove = throttle(handleMove, 200);
    switch (item[1].getClassName()) {
        case 'Rect':
            element = <Rect {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={throttleHandleMove} onDragMove={throttleHandleMove}></Rect>
            break;
        case 'Circle':
            element = <Circle {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={throttleHandleMove} onDragMove={throttleHandleMove}></Circle>
            break;
        case 'Line':
            element = <Line {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={throttleHandleMove} onDragMove={throttleHandleMove}></Line>
            break;
        default:
            element = null;
            break;
    }
    return (
        <>
            {element}
        </>
    )
})
export default Shape;