import konva from 'konva';
import { Rect, Circle, Line } from 'react-konva';
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import throttle from '../../utils/throttle';
import { toJS } from 'mobx';
const Shape = observer(({ item, transformerRef }: { item: [string, konva.Shape], transformerRef: konva.Transformer | null }) => {
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
    const throttleHandleMove = throttle(handleMove, 1000);
    const handleEnd = (e: konva.KonvaEventObject<DragEvent>) => {
        switch (e.target.getClassName()) {
            case 'Rect':
                const rect = new konva.Rect(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), rect);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'update',
                    eId: e.target.id(),
                    data: rect
                });
                if (store.boardElementStore.undoRedoElement.length === transformerRef?.nodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement));
                }
                break;
            case 'Circle':
                const circle = new konva.Circle(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), circle);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'update',
                    eId: e.target.id(),
                    data: circle
                });
                if (store.boardElementStore.pushUndoRedoElement.length === transformerRef?.nodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement));
                }
                break;
            case 'Line':
                const line = new konva.Line(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), line);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'update',
                    eId: e.target.id(),
                    data: line
                });
                if (store.boardElementStore.pushUndoRedoElement.length === transformerRef?.nodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement));
                }
                break;
        }
    }
    switch (item[1].getClassName()) {
        case 'Rect':
            element = <Rect {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={handleEnd} onDragMove={throttleHandleMove}></Rect>
            break;
        case 'Circle':
            element = <Circle {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={handleEnd} onDragMove={throttleHandleMove}></Circle>
            break;
        case 'Line':
            element = <Line {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={handleEnd} onDragMove={throttleHandleMove}></Line>
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