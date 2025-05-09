// components/CoinList.js
 useEffect(() => {
   (async () => {
-    setCoins(null);
+    console.log('––> CoinList mounted, search=', search);
+    setCoins(null);
     try {
-      let list = [];
+      let list = [];
+      console.log('––> starting fetch, search=', search);

       if (search && search.trim()) {
-        const creators = await searchCreatorsByUsername(search.trim());
+        const creators = await searchCreatorsByUsername(search.trim());
+        console.log('––> creators found:', creators);

         for (const c of creators) {
-          const tokens = await fetchCoinsByCreator(c.address);
+          const tokens = await fetchCoinsByCreator(c.address);
+          console.log(`––> tokens for ${c.handle}:`, tokens);

           tokens.forEach(t =>
             list.push({ ...t, creatorHandle: c.handle })
           );
         }
       } else {
-        const tops = await fetchTopCoins();
+        const tops = await fetchTopCoins();
+        console.log('––> top coins:', tops);

         tops.forEach(t =>
           list.push({ ...t, creatorHandle: null })
         );
       }

-      setCoins(list);
+      console.log('––> final list:', list);
+      setCoins(list);
     } catch (err) {
       console.error('[CoinList] error:', err);
       setCoins([]);
     }
   })();
 }, [search]);

// components/CoinList.js
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { fetchTopCoins, searchCreatorsByUsername, fetchCoinsByCreator } from '../lib/zora';
import TokenCard from './TokenCard';
import { AuthContext } from '../context/AuthContext';

export default function CoinList({ search }) {
  const { account } = useContext(AuthContext);
  const [coins, setCoins] = useState(null);
  const [watched, setWatched] = useState({});

  useEffect(() => {
    (async () => {
      setCoins(null);
      let list = [];
      if (search) {
        const creators = await searchCreatorsByUsername(search);
        for (let c of creators) {
          const tokens = await fetchCoinsByCreator(c.address);
          tokens.forEach(t => list.push({ ...t, creatorHandle: c.handle }));
        }
      } else {
        const tops = await fetchTopCoins();
        tops.forEach(t => list.push({ ...t, creatorHandle: null }));
      }
      setCoins(list);
    })();
  }, [search]);

  if (coins === null) return <p>Memuat…</p>;
  if (!coins.length) return <p>Tidak ada koin.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coins.map(c => (
        <Link key={c.address} href={`/coin/${c.address}`} passHref>
          <a><TokenCard
            coin={c}
            onBuy={() => alert('Buka detail untuk Buy')}
            onSell={() => alert('Buka detail untuk Sell')}
            onWatch={() => {
              fetch('/api/webhook', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({action:'watch',coin:c,fid:account})
              });
              setWatched(w=>({...w,[c.address]:!w[c.address]}));
            }}
            watched={!!watched[c.address]}
          /></a>
        </Link>
      ))}
    </div>
  );
}
