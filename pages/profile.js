import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { account } = useContext(AuthContext);
  const [watchedList, setWatchedList] = useState([]);

  useEffect(() => {
    // fetch watched creators from backend
  }, [account]);

  return (
    <Layout>
      <h2 className="text-lg font-bold mb-2">Profil</h2>
      <ul className="list-disc pl-5">
        {watchedList.map(c => (
          <li key={c.address}>{c.name}</li>
        ))}
      </ul>
    </Layout>
  );
}