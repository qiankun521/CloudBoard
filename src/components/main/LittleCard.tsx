import styles from '../../assets/styles/Main/LittleCard.module.scss';
const LittleCard=({src,description}:{src:string,description:string})=>{
    return (
        <section className={styles.cardContainer}>
            <div className={styles.card}>
                <img src={src} alt="照片" style={{maxHeight:'80px'}}/>
            </div>
            <p>{description}</p>
        </section>
    )
}

export default LittleCard;