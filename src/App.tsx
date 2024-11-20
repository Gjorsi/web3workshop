import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Web3, { AbiItem, Contract } from 'web3'
import getWeb3 from './GetWeb3'
import storageContract from './contracts/Storage.json';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {
  const [provider, setProvider] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [balance, setbalance] = useState<bigint | 0>();
  const [contract, setcontract] = useState<Contract<AbiItem[]>>();
  const [inputNumber, setinputNumber] = useState<number>(0);
  const [contractNumber, setcontractNumber] = useState<number | null>();

  const getAcc = async () => {
    const accs = await provider?.eth.getAccounts();
    const acc = accs?.[0] ?? '';
    setAccount(acc);
    const balance = await provider?.eth.getBalance(acc) ?? 0;
    setbalance(balance);
  }

  const getProvider = async () => {
      const prov = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      setProvider(prov);
  }

  const getAnyProvider = async () => {
    const prov = await getWeb3();
    setProvider(prov);
  }

  useEffect(() => {
    getAnyProvider();
  }, []);
  
  useEffect(() => {
    if (provider) {
      const contr = new provider.eth.Contract(storageContract as AbiItem[], CONTRACT_ADDRESS);
      setcontract(contr);
    }
  }, [provider]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value; // Always a string
    const numericValue = parseFloat(inputValue); // Convert to number
    if (!isNaN(numericValue)) {
      setinputNumber(numericValue);
    } else {
      setinputNumber(0); // Fallback value
    }
  };

  const setNumber = async () => {
    const success = await contract?.methods.store(inputNumber).send({from:account});
  }

  const getNumber = async () => {
    const number = await contract?.methods.retrieve().call();
    setcontractNumber(Number(number as unknown as bigint));
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <button onClick={() => getAcc()}>Get wallet</button>
      <p>Your address: {account}</p>
      <p>Your balance: {balance as number > 0 ? Web3.utils.fromWei(balance as number, 'ether') : 0} ETH</p>

      <input value={inputNumber} onChange={handleChange} type='number' />
      <button onClick={() => setNumber()}>Set Number</button>
      <p>Contract number: {contractNumber}</p>
      <button onClick={() => getNumber()}>Get Number</button>
      </>
  )
}

export default App
