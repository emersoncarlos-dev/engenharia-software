import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CoordenadorRepositorios.css';

function CoordenadorRepositorios() {
  const navigate = useNavigate();
  const [repositorios, setRepositorios] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('repositorios');
    if (stored) setRepositorios(JSON.parse(stored));
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = repositorios.map(repo =>
      repo.id === id ? { ...repo, status: newStatus } : repo
    );
    setRepositorios(updated);
    localStorage.setItem('repositorios', JSON.stringify(updated));
  };

  const pendentes = repositorios.filter(repo => repo.status === 'pending');

  return (
    <div className="coordenador-container">
      <header className="coordenador-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>← Voltar</button>
        <h1>Área do Coordenador – Repositórios Pendentes</h1>
      </header>

      <div className="repos-list">
        {pendentes.length === 0 ? (
          <p className="empty-message">Nenhum repositório aguardando aprovação.</p>
        ) : (
          pendentes.map(repo => (
            <div key={repo.id} className="repo-card">
              <div className="repo-info">
                <h3>{repo.titulo}</h3>
                <p>{repo.descricao || 'Sem descrição'}</p>
                <p><strong>Aluno:</strong> {repo.userName}</p>
                <p><strong>Formação:</strong> {repo.formationId} (consulte lista de formações)</p>
                <p><strong>Visibilidade solicitada:</strong> {repo.visibilidade === 'publico' ? '🌍 Público' : '🔒 Privado'}</p>
                {repo.arquivo && (
                  <a href={repo.arquivo.dataURL} download={repo.arquivo.name} target="_blank" rel="noopener noreferrer">
                    📄 {repo.arquivo.name}
                  </a>
                )}
              </div>
              <div className="repo-actions">
                <button className="btn-approve" onClick={() => updateStatus(repo.id, 'approved')}>✅ Aprovar</button>
                <button className="btn-reject" onClick={() => updateStatus(repo.id, 'rejected')}>❌ Rejeitar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default CoordenadorRepositorios;