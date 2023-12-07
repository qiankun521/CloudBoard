import { storeContext } from '../../stores/storeContext';
import { useContext } from 'react';
import Shape from './Shape';
import { Rect, Circle } from 'react-konva';
import { observer } from "mobx-react-lite";
import { Transform } from 'stream';
const StaticLayer = observer(() => {
    const store = useContext(storeContext);
    return (
        <>
            {
                store.boardElementStore.static.map((item) =>
                    <Shape item={item} key={item[0]}></Shape>
                )
            }
            <Rect
                width={100}
                height={90}
                fill="red"
                x={300}
                y={100}
                scale={{ x: 0.855634187396718, y: 1.0777357889658714 }}
                rotation={20.987394953834748}
                skewX={-0.5413840807879012}
                skewY={0}
                offset={{ x: 0, y: 0 }}
            ></Rect>
        </>
    )
})
export default StaticLayer;