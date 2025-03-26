import axios from '@/api/axios';
const getCryptos = async () => {
    const response = await axios.get('/cryptos');
    return response.data;
};
const getCrypto = async (symbol) => {
    const response = await axios.get(`/cryptos/${symbol}`);
    return response.data;
};
const getUpdatedCrypto = async (symbol) => {
    const response = await axios.get(`/cryptos/${symbol}/get-update`);
    return response.data;
};
const createCrypto = async (crypto) => {
    const response = await axios.post('/cryptos', crypto);
    return response.data;
};
const updateCrypto = async (symbol, crypto) => {
    const response = await axios.put(`/cryptos/${symbol}`, crypto);
    return response.data;
};
const deleteCrypto = async (symbol) => {
    const response = await axios.delete(`/cryptos/${symbol}`);
    return response.data;
};
const deleteCryptos = async () => {
    const response = await axios.delete('/cryptos');
    return response.data;
};
const cryptoAPI = {
    getCrypto,
    getCryptos,
    getUpdatedCrypto,
    createCrypto,
    updateCrypto,
    deleteCrypto,
    deleteCryptos
};
export default cryptoAPI;
