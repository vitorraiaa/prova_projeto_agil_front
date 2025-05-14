// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const roles = user?.['https://musica-insper.com/roles'] || [];

  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        {isAuthenticated ? (
          <>
            <span>Olá, {user.email}</span>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              style={{ marginLeft: '1rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login</button>
        )}
      </nav>

      <div style={{ padding: '1rem' }}>
        {isAuthenticated ? (
          <>
            {/* botão só para ADMIN */}
            {roles.includes('ADMIN') && (
              <Link to="/nova">
                <button>Criar nova tarefa</button>
              </Link>
            )}

            {/* rotas */}
            <Routes>
              <Route path="/" element={<TaskList roles={roles} />} />
              {roles.includes('ADMIN') && (
                <Route path="/nova" element={<TaskForm />} />
              )}
            </Routes>
          </>
        ) : (
          <p>Você precisa fazer login para ver as tarefas.</p>
        )}
      </div>
    </>
  );
}

export default App;