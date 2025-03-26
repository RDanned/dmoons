import axios from '@/api/axios';
import {CryptocurrencyCreateForm} from '@/types/crypto.ts';

const getCryptos = async () => {
  const response = await axios.get('/cryptos');
  return response.data;
}

const getCrypto = async (symbol: string) => {
  const response = await axios.get(`/cryptos/${symbol}`);
  return response.data;
}

const getUpdatedCrypto = async (symbol: string) => {
  const response = await axios.get(`/cryptos/${symbol}/get-update`);
  return response.data;
}

const createCrypto = async (crypto: CryptocurrencyCreateForm) => {
  const response = await axios.post('/cryptos', crypto);
  return response.data;
}

const updateCrypto = async (symbol: string, crypto: CryptocurrencyCreateForm) => {
  const response = await axios.put(`/cryptos/${symbol}`, crypto);
  return response.data;
}

const deleteCrypto = async (symbol: string) => {
  const response = await axios.delete(`/cryptos/${symbol}`);
  return response.data;
}

const deleteCryptos = async () => {
  const response = await axios.delete('/cryptos');
  return response.data;
}


const cryptoAPI = {
  getCrypto,
  getCryptos,
  getUpdatedCrypto,
  createCrypto,
  updateCrypto,
  deleteCrypto,
  deleteCryptos
}

export default cryptoAPI;