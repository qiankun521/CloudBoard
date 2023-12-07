import { Route,Routes } from 'react-router-dom';
import styles from '../assets/styles/MainPage.module.scss';
import MainLeft from './main/MainLeft';
import Main from './main/Main';
import RecentlyPage from './RecentlyPage';
const MainPage = () => {
  return (
    <main className={styles.mainPage}>
      <MainLeft></MainLeft>
      <Routes>
        <Route path='/' element={<Main></Main>}></Route>
        <Route path='recently' element={<RecentlyPage></RecentlyPage>}></Route>
      </Routes>
    </main>
  );
};
export default MainPage;