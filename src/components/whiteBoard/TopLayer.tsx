import konva from 'konva';
import { Layer, Rect } from 'react-konva';
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import throttle from '../../utils/throttle';
const TopLayer = observer(() => {
    const store = useContext(storeContext);
    return (
        <Layer>
            <Rect
                x={store.boardElementStore.selectElement.x}
                y={store.boardElementStore.selectElement.y}
                width={store.boardElementStore.selectElement.width}
                height={store.boardElementStore.selectElement.height}
                fill='#7878f8'
                strokeWidth={1}
                id='selectBox'
            ></Rect>
        </Layer>
    )
})
export default TopLayer;