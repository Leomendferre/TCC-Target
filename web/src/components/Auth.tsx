import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../lib/axios"

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await api.post('/login', { username, password });
        navigate('/app');
      } else {
        await api.post('/register', { username, password });
        alert('Usuário registrado com sucesso');
        setIsLogin(true);
      }
    } catch (error) {
      alert('Erro ao autenticar usuário');
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 text-white shadow-md rounded-lg">
        <div className="flex justify-around">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 ${isLogin ? 'font-bold border-b-2 border-blue-500' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 ${!isLogin ? 'font-bold border-b-2 border-blue-500' : ''}`}
          >
            Criar conta
          </button>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <h2 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Criar conta'}</h2>
          <div>
            <label className="block text-gray-300">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-300">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {isLogin ? 'Login' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
