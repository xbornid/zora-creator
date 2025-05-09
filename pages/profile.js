// pages/profile.js
import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { account } = useContext(AuthContext);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    if (!account) return;
    fetch(`/api/profile?fid=${account}`)
      .then(res => res.json())
      .then(data => setCreators(data.creators || []))
      .catch(console.error);
  }, [account]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <h2 className="text-lg mb-2">Creator yang Dipantau</h2>
      {creators.length === 0 ? (
        <p className="text-gray-500">Anda belum memantau creator apa pun.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {creators.map(addr => (
            <li key={addr}>{addr}</li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
