import './App.css';
import store from './stores';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { storeContext } from './stores/storeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
import React from 'react';
const WhiteBoardPage = React.lazy(() => import('./components/WhiteBoardPage'));
const MainPage = React.lazy(() => import('./components/MainPage'));
const NotFoundPage = React.lazy(() => import('./components/NotFound'));
const AllModal = React.lazy(() => import('./components/modal/AllModal'));
const RedirectToHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home');
  }, [navigate])
  return null;
}
function App() {
  return (
    <BrowserRouter>
      <storeContext.Provider value={store}>
        <AllModal></AllModal>
        <Routes>
          <Route path='/' element={
            <Suspense fallback={<div>loading...</div>}>
              <RedirectToHome></RedirectToHome>
            </Suspense>
          }></Route>
          <Route path='/home/*' element={
            <Suspense fallback={<div>loading...</div>}>
              <MainPage></MainPage>
            </Suspense>
          }></Route>
          <Route path='/whiteboard/:id' element={
            <Suspense fallback={<div>loading...</div>}>
              <WhiteBoardPage></WhiteBoardPage>
            </Suspense>
          }></Route>
          <Route path='*' element={<NotFoundPage></NotFoundPage>}></Route>
        </Routes>
      </storeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
