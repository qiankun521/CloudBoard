import styles from '../../assets/styles/Main/LittleCard.module.scss';
import { useContext } from 'react';
import { storeContext } from '../../stores/storeContext';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
const LittleCard = ({ src, description, type, id }: { src: string, description: string, type: 'new' | 'templete', id?: string }) => {
    const store = useContext(storeContext);
    const navigate = useNavigate();
    const handleClick = () => {
        if (type === 'new') {
            store.loginRegisterStore.createWhiteBoard()?.then((uuid) => {
                navigate(`/whiteboard/${uuid}`);
            }).catch((err) => {
                message.error(err);
            });
        } else if (type === 'templete') {
            store.loginRegisterStore.createTemplateWhiteBoard(undefined, id)?.then((uuid) => {
                navigate(`/whiteboard/${uuid}`);
            }).catch((err) => {
                message.error(err);
            });
        }
    }
    return (
        <section className={styles.cardContainer} onClick={handleClick}>
            <div className={styles.card}>
                <img src={src} alt="照片" style={{ maxHeight: '80px' }} />
            </div>
            <p>{description}</p>
        </section>
    )
}
export default LittleCard;