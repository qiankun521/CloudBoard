import { Route, Routes } from 'react-router-dom';
import styles from '../assets/styles/MainPage.module.scss';
import MainLeft from './main/MainLeft';
import Main from './main/Main';
import RecentlyPage from './RecentlyPage';
import { useEffect, useContext } from 'react';
import { storeContext } from '../stores/storeContext';
const MainPage = () => {
  const store = useContext(storeContext);
  useEffect(() => {
    store.loginRegisterStore.loadData();
  }, []);
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