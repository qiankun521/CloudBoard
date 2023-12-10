import konva from 'konva';
import { Layer, Rect, Circle, Line } from 'react-konva';
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import throttle from '../../utils/throttle';
const TopLayer = observer(() => {
    const store = useContext(storeContext);
    return (
        <Layer>
            {store.boardElementStore.status === 'select' &&
                <Rect
                    x={store.boardElementStore.selectElement.x}
                    y={store.boardElementStore.selectElement.y}
                    width={store.boardElementStore.selectElement.width}
                    height={store.boardElementStore.selectElement.height}
                    fill='#7878f8'
                    strokeWidth={1}
                    id='selectBox'
                ></Rect>
            }
            {(store.boardElementStore.status === 'rect' && store.boardElementStore.createElement.x !== 0) &&
                <Rect
                    x={store.boardElementStore.createElement.lastX}
                    y={store.boardElementStore.createElement.lastY}
                    width={store.boardElementStore.createElement.x - store.boardElementStore.createElement.lastX}
                    height={store.boardElementStore.createElement.y - store.boardElementStore.createElement.lastY}
                    stroke='black'
                    strokeWidth={1}
                    id='createRect'
                ></Rect>
            }
            {(store.boardElementStore.status === 'circle' && store.boardElementStore.createElement.lastX !== 0) &&
                <Circle
                    x={store.boardElementStore.createElement.lastX}
                    y={store.boardElementStore.createElement.lastY}
                    radius={Math.sqrt(Math.pow(store.boardElementStore.createElement.lastX - store.boardElementStore.createElement.x, 2) + Math.pow(store.boardElementStore.createElement.lastY - store.boardElementStore.createElement.y, 2))}
                    stroke='black'
                    strokeWidth={1}
                    id='createCircle'
                ></Circle>
            }
            {(store.boardElementStore.status === 'line' && store.boardElementStore.createElement.lastX !== 0 && store.boardElementStore.createElement.x !== 0) &&
                <Line
                    points={[store.boardElementStore.createElement.lastX, store.boardElementStore.createElement.lastY, store.boardElementStore.createElement.x, store.boardElementStore.createElement.y]}
                    stroke='black'
                    strokeWidth={1}
                    id='createLine'
                ></Line>
            }
            {(store.boardElementStore.status === 'Spline' && store.boardElementStore.createAdvancedElement.length >= 4) &&
                <Line
                    points={[...store.boardElementStore.createAdvancedElement]}
                    stroke='black'
                    strokeWidth={1}
                    id='createSpline'
                    tension={1}
                ></Line>
            }
        </Layer>
    )
})
export default TopLayer;