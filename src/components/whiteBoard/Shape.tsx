import konva from 'konva';
import { Rect } from 'react-konva';

const Shape = ({ item }: { item: [string, konva.Shape] }) => {
    let element;
    switch (item[1].getClassName()) {
        case 'Rect':
            element = <Rect {...item[1].attrs}></Rect>
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