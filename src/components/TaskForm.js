import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('BAIXA');
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    await fetch(`${process.env.REACT_APP_API_URL}/tarefa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        // opcional: você pode omitir e ler do token no backend
        creatorEmail: user.email,
      }),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Tarefa</h2>
      <div>
        <label>Título:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Prioridade:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>BAIXA</option>
          <option>MEDIA</option>
          <option>ALTA</option>
        </select>
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}
