import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginButton from "./Components/LoginButton";
import MainPage from './Pages/mainPage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginButton />} />
          <Route path='/home' element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
