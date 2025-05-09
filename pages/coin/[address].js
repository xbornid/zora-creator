// pages/coin/[address].js
import Layout from '../../components/Layout';
import { fetchCoinDetails, fetchCoinHistory } from '../../lib/zora';
import { parseEther } from 'ethers';
import { useWarplet } from '../../lib/wallet';

export default function CoinDetail({ coin, history }) {
  const { signer } = useWarplet();
  return (
    <Layout>
      <h1 className="text-2xl font-bold">{coin.name}</h1>
      <p>Creator: {coin.creatorAddress}</p>
      <p>Market Cap: ${Number(coin.marketCap).toLocaleString()}</p>
      <section>
        <h2 className="mt-4 font-semibold">History</h2>
        <ul>
          {history.map((h,i)=>(
            <li key={i}>{h.type} – {h.amount}</li>
          ))}
        </ul>
      </section>
      <div className="mt-4 space-x-2">
        <button onClick={async()=>{
          const tx=await signer.sendTransaction({to:coin.address,value:parseEther('0.1')});
          await tx.wait();alert('Bought');
        }}>Buy</button>
        <button onClick={async()=>{
          const tx=await signer.sendTransaction({to:coin.owner,data:'0x'});
          await tx.wait();alert('Sold');
        }}>Sell</button>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({params}) {
  const coin = await fetchCoinDetails(params.address);
  const history = await fetchCoinHistory(params.address);
  return {props:{coin,history}};
}
