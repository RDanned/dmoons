import '@ant-design/v5-patch-for-react-19';
import {useEffect, useState} from 'react';
import {Button, Modal, Space} from 'antd';
import '@/tailwind.css';
import '@/index.scss';
import {Cryptocurrency, CryptocurrencyCreateForm} from '@/types/crypto';
import cryptoAPI from '@/api/crypto';
import AddCryptoModal from './components/AddCryptoModal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import CryptoCard from '@/components/CryptoCard';

function App() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [activeCrypto, setActiveCrypto] = useState<Cryptocurrency | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [chartData, setChartData] = useState<{ time: number; price: number }[]>([]);

  useEffect(() => {
    cryptoAPI.getCryptos().then((data) => {
      setCryptos(data);
      if (data.length > 0) {
        setActiveCrypto(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeCrypto) return;
    const interval = setInterval(() => {
      cryptoAPI
        .getUpdatedCrypto(activeCrypto.symbol)
        .then((updatedData) => {
          setChartData((prev) => [
            ...prev,
            {time: Date.now(), price: updatedData.current_price},
          ]);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 60000);
    return () => clearInterval(interval);
  }, [activeCrypto]);

  const handleAddCrypto = (cryptoName: string) => {
    setModalVisible(false);
    const cryptoForm: CryptocurrencyCreateForm = {symbol: cryptoName};
    cryptoAPI
      .createCrypto(cryptoForm)
      .then((newCrypto) => {
        setCryptos((prev) => [...prev, newCrypto]);
        setActiveCrypto(newCrypto);
        setChartData([]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRemoveCryptos = () => {
    Modal.confirm({
      title: 'Remove All Cryptos',
      content: 'Are you sure you want to remove all cryptos?',
      onOk: () => {
        cryptoAPI
          .deleteCryptos()
          .then(() => {
            setCryptos([]);
            setActiveCrypto(null);
            setChartData([]);
          })
          .catch((err) => {
            console.error(err);
          });
      },
    })
  }

  const initialPrice = chartData.length > 0 ? chartData[0].price : activeCrypto?.current_price || 0;

  return (
    <div style={{padding: '20px'}}>
      <Space style={{marginBottom: '20px'}}>
        <div className="flex flex-col">
          <div className="flex flex-row gap-4">
            <Button type="primary" onClick={() => setModalVisible(true)}>
              Add Crypto
            </Button>
            <Button onClick={handleRemoveCryptos}>
              Remove All Cryptos
            </Button>
          </div>

          <div className="flex flex-row gap-4 mt-4">
            {cryptos.map((crypto) => (
              <CryptoCard
                key={`crypto-${crypto.id}`}
                crypto={crypto}
                activeCrypto={activeCrypto}
                onClick={(crypto) => {
                  setActiveCrypto(crypto);
                  setChartData([]);
                }}/>
            ))}
          </div>
        </div>
      </Space>

      <AddCryptoModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onAdd={handleAddCrypto}
      />
      {activeCrypto && (
        <div style={{marginTop: '20px'}}>
          <h2>{activeCrypto.symbol} Price Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis
                dataKey="time"
                type="number"
                domain={
                  chartData.length > 1
                    ? [chartData[0].time, chartData[chartData.length - 1].time]
                    : [chartData[0]?.time || 0, chartData[0]?.time ? chartData[0].time + 1000 : 1000]
                }
                padding={{left: 0, right: 0}}
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis domain={[0, initialPrice * 10]}/>
              <Tooltip
                labelFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
