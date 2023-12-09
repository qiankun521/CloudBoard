import konva from 'konva';
import { Rect } from 'react-konva';
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import throttle from '../../utils/throttle';
const Shape = ({ item }: { item: [string, konva.Shape] }) => {
    let element;
    const store = useContext(storeContext);
    const handleMove = (e: konva.KonvaEventObject<DragEvent>) => {
        store.boardElementStore.updateActive(e.target.id(), new konva.Rect(e.target.attrs));
    }
    const throttleHandleMove = throttle(handleMove, 100);
    switch (item[1].getClassName()) {
        case 'Rect':
            element = <Rect {...item[1].getAttrs()} draggable onDragEnd={throttleHandleMove} onDragMove={throttleHandleMove}></Rect>
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
}
export default Shape;