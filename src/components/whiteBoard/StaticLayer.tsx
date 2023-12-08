import { storeContext } from '../../stores/storeContext';
import { useContext } from 'react';
import Shape from './Shape';
import { observer } from "mobx-react-lite";
const StaticLayer = observer(() => {
    const store = useContext(storeContext);
    return (
        <>
            {
                store.boardElementStore.static.map((item) =>
                    <Shape item={item} key={item[0]}></Shape>
                )
            }
        </>
    )
})
export default StaticLayer;