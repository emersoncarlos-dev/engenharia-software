import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ← apenas uma chave de fechamento
import aprendizagemImg from '../assets/aprendizagem.PNG';
import serLogo from '../assets/ser-logo.png';

function Login() {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!matricula.trim() || !senha.trim()) {
      setError('Preencha matrícula e senha.');
      return;
    }

    // Coordenador: matrícula "coordenador" e senha "admin123"
    if (matricula === 'coordenador' && senha === 'admin123') {
      navigate('/coordenador');
    } else {
      // Aluno (qualquer outra credencial)
      navigate('/dashboard');
    }
  };

  return (
    <main className="innovation-system">
      <div className="container">
        <div className="left-panel">
          <img src={aprendizagemImg} alt="Sistema de Aprendizagem Inovador" className="left-image" />
        </div>
        <div className="right-panel login-panel">
          <div className="login-card">
            <div className="logo-container">
              <img src={serLogo} alt="Ser Educacional" className="logo-image" />
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="matricula">Matrícula</label>
                <input
                  type="text"
                  id="matricula"
                  placeholder="Digite sua matrícula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn-entrar">Entrar</button>
            </form>
            <div className="login-links">
              <a href="#" className="link-recuperar">Não sabe sua senha? Recupere seu acesso</a>
              <a href="#" className="link-alterar">Desejo trocar a senha. Alteração de Senha</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;