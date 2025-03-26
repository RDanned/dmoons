import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '@ant-design/v5-patch-for-react-19';
import { useEffect, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import '@/tailwind.css';
import '@/index.scss';
import cryptoAPI from '@/api/crypto';
import AddCryptoModal from './components/AddCryptoModal';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, } from 'recharts';
import CryptoCard from '@/components/CryptoCard';
function App() {
    const [cryptos, setCryptos] = useState([]);
    const [activeCrypto, setActiveCrypto] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        cryptoAPI.getCryptos().then((data) => {
            setCryptos(data);
            if (data.length > 0) {
                setActiveCrypto(data[0]);
            }
        });
    }, []);
    useEffect(() => {
        if (!activeCrypto)
            return;
        const interval = setInterval(() => {
            cryptoAPI
                .getUpdatedCrypto(activeCrypto.symbol)
                .then((updatedData) => {
                setChartData((prev) => [
                    ...prev,
                    { time: Date.now(), price: updatedData.current_price },
                ]);
            })
                .catch((err) => {
                console.error(err);
            });
        }, 60000);
        return () => clearInterval(interval);
    }, [activeCrypto]);
    const handleAddCrypto = (cryptoName) => {
        setModalVisible(false);
        const cryptoForm = { symbol: cryptoName };
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
        });
    };
    const initialPrice = chartData.length > 0 ? chartData[0].price : activeCrypto?.current_price || 0;
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx(Space, { style: { marginBottom: '20px' }, children: _jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex flex-row gap-4", children: [_jsx(Button, { type: "primary", onClick: () => setModalVisible(true), children: "Add Crypto" }), _jsx(Button, { onClick: handleRemoveCryptos, children: "Remove All Cryptos" })] }), _jsx("div", { className: "flex flex-row gap-4 mt-4", children: cryptos.map((crypto) => (_jsx(CryptoCard, { crypto: crypto, activeCrypto: activeCrypto, onClick: (crypto) => {
                                    setActiveCrypto(crypto);
                                    setChartData([]);
                                } }, `crypto-${crypto.id}`))) })] }) }), _jsx(AddCryptoModal, { visible: modalVisible, onCancel: () => setModalVisible(false), onAdd: handleAddCrypto }), activeCrypto && (_jsxs("div", { style: { marginTop: '20px' }, children: [_jsxs("h2", { children: [activeCrypto.symbol, " Price Chart"] }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "time", type: "number", domain: chartData.length > 1
                                        ? [chartData[0].time, chartData[chartData.length - 1].time]
                                        : [chartData[0]?.time || 0, chartData[0]?.time ? chartData[0].time + 1000 : 1000], padding: { left: 0, right: 0 }, tickFormatter: (time) => new Date(time).toLocaleTimeString() }), _jsx(YAxis, { domain: [0, initialPrice * 10] }), _jsx(Tooltip, { labelFormatter: (time) => new Date(time).toLocaleTimeString() }), _jsx(Line, { type: "monotone", dataKey: "price", stroke: "#8884d8", dot: false })] }) })] }))] }));
}
export default App;
