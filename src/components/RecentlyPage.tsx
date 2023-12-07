import styles from '../assets/styles/RecentlyPage.module.scss';
import Head from './Head';
import Recently from './main/Recently';
const RecentlyPage = () => {
    return (
        <div className={styles.container}>
            <Head title='最近使用'></Head>
            <div className={styles.recently}>
                <Recently></Recently>
            </div>
        </div>
        
    )
}
export default RecentlyPage;