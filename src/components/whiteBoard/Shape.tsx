import konva from 'konva';
import { Rect, Circle, Line } from 'react-konva';
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import throttle from '../../utils/throttle';
import { toJS } from 'mobx';
const Shape = observer(({ item, transformerRef }: { item: [string, konva.Shape], transformerRef: any }) => {
    let element;
    const store = useContext(storeContext);
    const handleMove = (e: konva.KonvaEventObject<DragEvent>) => {
        switch (e.target.getClassName()) {
            case 'Rect':
                const rect = new konva.Rect(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), rect);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'temp',
                    eId: e.target.id(),
                    data: rect
                });
                console.log(store.boardElementStore.undoRedoElement.length, transformerRef?.current.getNodes().length);
                if (transformerRef && transformerRef.current && store.boardElementStore.undoRedoElement.length === transformerRef?.current.getNodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement), 'temp');
                }
                break;
            case 'Circle':
                const circle = new konva.Circle(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), circle);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'temp',
                    eId: e.target.id(),
                    data: circle
                });
                if (transformerRef && transformerRef.current && store.boardElementStore.undoRedoElement.length === transformerRef?.current.getNodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement), 'temp');
                }
                break;
            case 'Line':
                const line = new konva.Line(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), line);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'temp',
                    eId: e.target.id(),
                    data: line
                });
                if (transformerRef && transformerRef.current && store.boardElementStore.undoRedoElement.length === transformerRef?.current.getNodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement), 'temp');
                }
                break;
        }
    }
    const throttleHandleMove = throttle(handleMove, 50);
    const handleMoveEnd = (e: konva.KonvaEventObject<DragEvent>) => {
        switch (e.target.getClassName()) {
            case 'Rect':
                const rect = new konva.Rect(e.target.attrs);
                store.boardElementStore.updateActive(e.target.id(), rect);
                store.boardElementStore.pushUndoRedoElement({
                    type: 'update',
                    eId: e.target.id(),
                    data: rect
                });
                if (transformerRef && transformerRef.current && store.boardElementStore.undoRedoElement.length === transformerRef?.current.getNodes().length){
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
                if (transformerRef && transformerRef.current && store.boardElementStore.undoRedoElement.length === transformerRef?.current.getNodes().length){
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
                if (transformerRef && transformerRef.current && store.boardElementStore.undoRedoElement.length === transformerRef?.current.getNodes().length) {
                    store.boardElementStore.pushUndoRedoStack(toJS(store.boardElementStore.undoRedoElement));
                }
                break;
        }
    }
    switch (item[1].getClassName()) {
        case 'Rect':
            element = <Rect {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={handleMoveEnd} onDragMove={throttleHandleMove}></Rect>
            break;
        case 'Circle':
            element = <Circle {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={handleMoveEnd} onDragMove={throttleHandleMove}></Circle>
            break;
        case 'Line':
            element = <Line {...item[1].getAttrs()} draggable={store.boardElementStore.status === 'select'} onDragEnd={handleMoveEnd} onDragMove={throttleHandleMove}></Line>
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