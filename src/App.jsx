import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/dashboard';
import ArquivosAcademicos from './components/ArquivosAcademicos';
import CoordenadorLogin from './components/CoordenadorLogin';
import CoordenadorRepositorios from './components/CoordenadorRepositorios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/arquivos-academicos" element={<ArquivosAcademicos />} />
        <Route path="/coordenador-login" element={<CoordenadorLogin />} />
         <Route path="/coordenador" element={<CoordenadorRepositorios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;