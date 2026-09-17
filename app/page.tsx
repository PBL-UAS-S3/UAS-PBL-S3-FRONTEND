'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesanError, setPesanError] = useState('');
  const router = useRouter();

  async function login() {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('nama', data.nama);
        router.push('/dashboard');
      } else {
        setPesanError(data.error || 'Login gagal');
      }
    } catch (err) {
      setPesanError('Gagal konek ke server');
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 400 }}>
      <h1>Login</h1>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />
      </div>
      {pesanError && <p style={{ color: 'red' }}>{pesanError}</p>}
      <button onClick={login}>Masuk</button>
    </main>
  );
}