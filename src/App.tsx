import './App.css';
import WhiteBoardPage from './components/WhiteBoardPage';
import MainPage from './components/MainPage';
import store from './stores';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { storeContext } from './stores/storeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import NotFound from './components/NotFound';
import AllModal from './components/modal/AllModal';
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
          <Route path='/' element={<RedirectToHome></RedirectToHome>}></Route>
          <Route path='/home/*' element={<MainPage></MainPage>}></Route>
          <Route path='/whiteboard/:id' element={<WhiteBoardPage></WhiteBoardPage>}></Route>
          <Route path='*' element={<NotFound></NotFound>}></Route>
        </Routes>
      </storeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
