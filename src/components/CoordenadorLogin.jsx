import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CoordenadorLogin.css';

function CoordenadorLogin() {
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // senha fixa para demonstração – em produção use autenticação real
    if (senha === 'admin123') {
      localStorage.setItem('coordinatorAuth', 'true');
      navigate('/coordenador');
    } else {
      setError('Senha incorreta');
    }
  };

  return (
    <div className="coordenador-login">
      <form onSubmit={handleSubmit}>
        <h2>Acesso Coordenador</h2>
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
export default CoordenadorLogin;