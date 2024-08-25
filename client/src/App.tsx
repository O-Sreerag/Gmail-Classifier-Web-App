import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ApiKeyProvider } from './Contexts/ApiKeyContext';
import { OAuthProvider } from './Contexts/OAuthContext';
import { ClassifiedEmailProvider } from './Contexts/ClassifiedEmailContext';

// pages
import LoginPage from './Pages/loginPage';
import MainPage from './Pages/mainPage';
import ErrorPage from './Pages/ErrorPage';
import { ProtectedRoute, PublicRoute } from './Utils/Routes';

function App() {
  return (
    <>
      <ClassifiedEmailProvider>
          <OAuthProvider>
            <ApiKeyProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path='/home' element={<ProtectedRoute>< MainPage/></ProtectedRoute>} />
                  <Route path='*' element={<ErrorPage />} />
                </Routes>
              </BrowserRouter>
            </ApiKeyProvider>
          </OAuthProvider>
      </ClassifiedEmailProvider>
    </>
  );
}

export default App;
