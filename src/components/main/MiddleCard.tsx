import styles from '../../assets/styles/Main/MiddleCard.module.scss';
import { SingleBoard } from '../../../global';
import { HiOutlineCollection } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
const MiddleCard = ({ data }: { data: SingleBoard[] }) => {
    const navigate = useNavigate();
    const handleJump = (e: MouseEvent<HTMLDivElement>) => {
        navigate('/whiteboard/' + e.currentTarget.id);
    }
    const handleCollect = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        //TODO 收藏操作
    }
    return (
        <section className={styles.container}>
            {
                data.map((value) => {
                    return (
                        <div className={styles.card} key={value.uuid} id={value.uuid} onClick={handleJump}>
                            <div className={styles.pictureContainer}>
                                <img src={value.src} alt='白板缩略图'></img>
                            </div>
                            <div className={styles.description}>
                                <h6>{value.name}</h6>
                                <p>{value?.lastEdit + ' 修改'}</p>
                            </div>
                            <div className={styles.icon} title='收藏' onClick={handleCollect}>
                                <HiOutlineCollection></HiOutlineCollection>
                            </div>
                        </div>
                    )
                })
            }
        </section>
    )
}
export default MiddleCard;