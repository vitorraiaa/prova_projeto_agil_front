// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = process.env.REACT_APP_API_URL;

export default function TaskList({ roles }) {
  const { getAccessTokenSilently } = useAuth0();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_URL}/tarefa`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Pode ser 403, 500, etc.
          console.error('Erro ao buscar tarefas:', res.status, res.statusText);
          setError(`Erro ${res.status}: ${res.statusText}`);
          setTasks([]);
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          setTasks(Array.isArray(data) ? data : []);
        } else {
          // Sem JSON no corpo → considera lista vazia
          setTasks([]);
        }
      } catch (e) {
        console.error('Falha na requisição:', e);
        setError('Falha na requisição de tarefas.');
        setTasks([]);
      }
    })();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}/tarefa/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error('Erro ao excluir tarefa:', res.status);
        alert(`Não foi possível excluir (status ${res.status})`);
        return;
      }
      setTasks((ts) => ts.filter((t) => t.id !== id));
    } catch (e) {
      console.error('Falha ao excluir tarefa:', e);
      alert('Falha na exclusão da tarefa.');
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Erro: {error}</div>;
  }

  return (
    <div>
      <h2>Minhas Tarefas</h2>
      {tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id} style={{ marginBottom: '0.5rem' }}>
              <strong>[{t.priority}]</strong> {t.title} — {t.description}{' '}
              (criado por {t.creatorEmail})
              {roles.includes('ADMIN') && (
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  🗑️
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
