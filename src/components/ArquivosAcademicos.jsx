import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ArquivosAcademicos.css';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Função auxiliar para obter o tamanho do arquivo formatado
function formatFileSize(bytes) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Função para obter um ícone representativo baseado no tipo de arquivo
function getFileIcon(file) {
  if (!file) return '📄';
  const ext = file.name.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
  if (['pdf'].includes(ext)) return '📑';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['txt'].includes(ext)) return '📃';
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜️';
  return '📎';
}

function ArquivosAcademicos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('meus');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('todos');
  const [selectedFormation, setSelectedFormation] = useState('');

  const user = {
    nome: 'Emerson Carlos',
    matricula: '01131724',
  };

  // Estado para formações
  const [formations, setFormations] = useState([]);
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [newFormationName, setNewFormationName] = useState('');

  // Estado para repositórios
  const [repositorios, setRepositorios] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    visibilidade: 'privado',
    formationId: '',
    arquivo: null,      // { name, type, size, dataURL }
    arquivoFile: null,  // arquivo original (File) para envio ao backend
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const storedRepos = localStorage.getItem('repositorios');
    if (storedRepos) setRepositorios(JSON.parse(storedRepos));

    const storedFormations = localStorage.getItem('formacoes');
    if (storedFormations) {
      setFormations(JSON.parse(storedFormations));
    } else {
      const defaultFormations = [
        { id: generateId(), name: 'ADS' },
        { id: generateId(), name: 'Ciência da Computação' },
      ];
      setFormations(defaultFormations);
      localStorage.setItem('formacoes', JSON.stringify(defaultFormations));
    }
  }, []);

  // Salvar repositórios e formações no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('repositorios', JSON.stringify(repositorios));
  }, [repositorios]);

  useEffect(() => {
    localStorage.setItem('formacoes', JSON.stringify(formations));
  }, [formations]);

  // Manipular seleção de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setForm({ ...form, arquivo: null, arquivoFile: null });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo de 5MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm({
        ...form,
        arquivo: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataURL: ev.target.result,
        },
        arquivoFile: file, // guarda o arquivo original para possível envio ao backend
      });
    };
    reader.readAsDataURL(file);
  };

  // Enviar novo repositório
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.formationId) {
      alert('Preencha o título e selecione uma formação.');
      return;
    }

    // ----- MODERAÇÃO COM IA (exemplo) -----
    // Se houver arquivo, envie para o backend antes de salvar.
    // if (form.arquivoFile) {
    //   const formData = new FormData();
    //   formData.append('file', form.arquivoFile);
    //   try {
    //     const response = await fetch('http://localhost:5000/api/upload', {
    //       method: 'POST',
    //       body: formData,
    //     });
    //     const data = await response.json();
    //     if (!response.ok) {
    //       alert(data.error || 'Arquivo bloqueado por conteúdo impróprio.');
    //       return;
    //     }
    //   } catch (err) {
    //     alert('Erro ao verificar arquivo. Tente novamente.');
    //     return;
    //   }
    // }

    const novo = {
      id: generateId(),
      userId: user.matricula,
      userName: user.nome,
      formationId: form.formationId,
      titulo: form.titulo,
      descricao: form.descricao,
      visibilidade: form.visibilidade,
      createdAt: new Date().toISOString(),
      arquivo: form.arquivo || null,
    };
    setRepositorios([novo, ...repositorios]);

    // Limpar formulário
    setForm({
      titulo: '',
      descricao: '',
      visibilidade: 'privado',
      formationId: '',
      arquivo: null,
      arquivoFile: null,
    });
    // Reset do input file
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  // Adicionar nova formação
  const addFormation = () => {
    if (!newFormationName.trim()) return;
    const newFormation = {
      id: generateId(),
      name: newFormationName.trim(),
    };
    setFormations([...formations, newFormation]);
    setNewFormationName('');
    setShowFormationModal(false);
  };

  // Alternar visibilidade
  const toggleVisibilidade = (id) => {
    setRepositorios(prev =>
      prev.map(repo =>
        repo.id === id
          ? { ...repo, visibilidade: repo.visibilidade === 'publico' ? 'privado' : 'publico' }
          : repo
      )
    );
  };

  // Excluir repositório
  const deleteRepositorio = (id) => {
    setRepositorios(prev => prev.filter(repo => repo.id !== id));
  };

  // Filtrar meus repositórios
  let meusRepos = repositorios.filter(repo => repo.userId === user.matricula);
  if (visibilityFilter !== 'todos') {
    meusRepos = meusRepos.filter(repo => repo.visibilidade === visibilityFilter);
  }
  if (selectedFormation) {
    meusRepos = meusRepos.filter(repo => repo.formationId === selectedFormation);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    meusRepos = meusRepos.filter(repo =>
      repo.titulo.toLowerCase().includes(term) ||
      repo.descricao.toLowerCase().includes(term)
    );
  }

  // Repositórios públicos de outras pessoas
  let outrosReposPublicos = repositorios.filter(
    repo => repo.userId !== user.matricula && repo.visibilidade === 'publico'
  );
  if (selectedFormation) {
    outrosReposPublicos = outrosReposPublicos.filter(repo => repo.formationId === selectedFormation);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    outrosReposPublicos = outrosReposPublicos.filter(repo =>
      repo.titulo.toLowerCase().includes(term) ||
      repo.descricao.toLowerCase().includes(term) ||
      repo.userName.toLowerCase().includes(term)
    );
  }

  // Obter nome da formação a partir do ID
  const getFormationName = (formationId) => {
    const formation = formations.find(f => f.id === formationId);
    return formation ? formation.name : 'Formação não especificada';
  };

  return (
    <div className="arquivos-fullscreen">
      <div className="arquivos-container">
        <header className="arquivos-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Voltar ao Dashboard
          </button>
          <h1>Arquivos Acadêmicos</h1>
        </header>

        <div className="tabs-bar">
          <div className="tabs">
            <button className={activeTab === 'meus' ? 'tab active' : 'tab'} onClick={() => setActiveTab('meus')}>
              Meus Repositórios
            </button>
            <button className={activeTab === 'turmas' ? 'tab active' : 'tab'} onClick={() => setActiveTab('turmas')}>
              Repositórios de Turmas
            </button>
          </div>

          <div className="right-actions">
            <div className="formation-selector">
              <select value={selectedFormation} onChange={(e) => setSelectedFormation(e.target.value)}>
                <option value="">Todas as formações</option>
                {formations.map(formation => (
                  <option key={formation.id} value={formation.id}>{formation.name}</option>
                ))}
              </select>
            </div>
            <div className="hamburger-menu">
              <button className="hamburger-btn" onClick={() => setShowFormationModal(true)}>
                ☰ Gerenciar formações
              </button>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por título, descrição ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'meus' && (
          <div className="tab-content">
            <div className="upload-card">
              <form className="upload-form" onSubmit={handleSubmit}>
                <h3>Criar novo repositório</h3>
                <input
                  type="text"
                  placeholder="Título"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
                <div className="form-row">
                  <select
                    value={form.formationId}
                    onChange={(e) => setForm({ ...form, formationId: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma formação</option>
                    {formations.map(formation => (
                      <option key={formation.id} value={formation.id}>{formation.name}</option>
                    ))}
                  </select>
                </div>
                <div className="visibilidade-select">
                  <label>
                    <input
                      type="radio"
                      value="privado"
                      checked={form.visibilidade === 'privado'}
                      onChange={() => setForm({ ...form, visibilidade: 'privado' })}
                    />
                    Privado (só você vê)
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="publico"
                      checked={form.visibilidade === 'publico'}
                      onChange={() => setForm({ ...form, visibilidade: 'publico' })}
                    />
                    Público (qualquer pessoa pode ver)
                  </label>
                </div>
                <div className="file-input-group">
                  <label htmlFor="file-input" className="file-label">
                    📎 Anexar arquivo (máx. 5MB)
                  </label>
                  <input type="file" id="file-input" onChange={handleFileChange} />
                  {form.arquivo && (
                    <div className="file-info">
                      {getFileIcon(form.arquivo)} {form.arquivo.name} ({formatFileSize(form.arquivo.size)})
                    </div>
                  )}
                </div>
                <button type="submit" className="btn-submit">Criar repositório</button>
              </form>
            </div>

            <div className="filters">
              <div className="filter-buttons">
                <button
                  className={visibilityFilter === 'todos' ? 'filter-active' : ''}
                  onClick={() => setVisibilityFilter('todos')}
                >
                  Todos
                </button>
                <button
                  className={visibilityFilter === 'publico' ? 'filter-active' : ''}
                  onClick={() => setVisibilityFilter('publico')}
                >
                  🌍 Públicos
                </button>
                <button
                  className={visibilityFilter === 'privado' ? 'filter-active' : ''}
                  onClick={() => setVisibilityFilter('privado')}
                >
                  🔒 Privados
                </button>
              </div>
            </div>

            <div className="repos-grid">
              {meusRepos.length === 0 ? (
                <div className="empty-message">
                  <p>Nenhum repositório encontrado.</p>
                </div>
              ) : (
                meusRepos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-header">
                      <h3>{repo.titulo}</h3>
                      <span className={`visibility-badge ${repo.visibilidade}`}>
                        {repo.visibilidade === 'publico' ? '🌍 Público' : '🔒 Privado'}
                      </span>
                    </div>
                    <p className="repo-description">{repo.descricao || 'Sem descrição'}</p>
                    <div className="repo-meta">
                      <small>Formação: {getFormationName(repo.formationId)}</small><br />
                      <small>Criado em: {new Date(repo.createdAt).toLocaleDateString()}</small>
                    </div>
                    {repo.arquivo && (
                      <div className="repo-attachment">
                        <a
                          href={repo.arquivo.dataURL}
                          download={repo.arquivo.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          {getFileIcon(repo.arquivo)} {repo.arquivo.name}
                          <span className="file-size">({formatFileSize(repo.arquivo.size)})</span>
                        </a>
                      </div>
                    )}
                    <div className="repo-actions">
                      <button onClick={() => toggleVisibilidade(repo.id)} className="btn-toggle">
                        {repo.visibilidade === 'publico' ? 'Tornar Privado' : 'Tornar Público'}
                      </button>
                      <button onClick={() => deleteRepositorio(repo.id)} className="btn-delete">
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'turmas' && (
          <div className="tab-content">
            <div className="repos-grid">
              {outrosReposPublicos.length === 0 ? (
                <div className="empty-message">
                  <p>Nenhum repositório público disponível para esta formação.</p>
                </div>
              ) : (
                outrosReposPublicos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <div className="repo-header">
                      <h3>{repo.titulo}</h3>
                      <span className="visibility-badge publico">🌍 Público</span>
                    </div>
                    <p className="repo-description">{repo.descricao || 'Sem descrição'}</p>
                    <div className="repo-meta">
                      <small>Autor: {repo.userName}</small><br />
                      <small>Formação: {getFormationName(repo.formationId)}</small><br />
                      <small>Criado em: {new Date(repo.createdAt).toLocaleDateString()}</small>
                    </div>
                    {repo.arquivo && (
                      <div className="repo-attachment">
                        <a
                          href={repo.arquivo.dataURL}
                          download={repo.arquivo.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          {getFileIcon(repo.arquivo)} {repo.arquivo.name}
                          <span className="file-size">({formatFileSize(repo.arquivo.size)})</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal para adicionar nova formação */}
      {showFormationModal && (
        <div className="modal-overlay" onClick={() => setShowFormationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Gerenciar formações</h3>
            <div className="formation-list">
              {formations.map(formation => (
                <div key={formation.id} className="formation-item">
                  <span>{formation.name}</span>
                  <button
                    onClick={() => {
                      setFormations(formations.filter(f => f.id !== formation.id));
                      if (selectedFormation === formation.id) setSelectedFormation('');
                    }}
                    className="remove-formation"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <div className="add-formation">
              <input
                type="text"
                placeholder="Nome da nova formação"
                value={newFormationName}
                onChange={(e) => setNewFormationName(e.target.value)}
              />
              <button onClick={addFormation}>Adicionar</button>
            </div>
            <button className="close-modal" onClick={() => setShowFormationModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArquivosAcademicos;