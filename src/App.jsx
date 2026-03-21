import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/dashboard';
import ArquivosAcademicos from './components/ArquivosAcademicos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/arquivos-academicos" element={<ArquivosAcademicos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;