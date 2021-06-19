// got address and abi from deploying contract Lottery.sol in Lottery Project Ethereum Udemy Course --> deploy.js
const address = '0xBe57df6d9cAf41a41827F2294D46380954bB58e8'
const abi = '[{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'

import React, { useContext, useState, useEffect } from 'react'
import Web3Context from '../context/web3Context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

const HomePage = () => {
  const ctx = useContext(Web3Context)
  const [contract, setContract] = useState(null)
  const [manager, setManager] = useState(null)
  const [players, setPlayers] = useState(null)
  const [totalEther, setTotalEther] = useState(null)

  const [enteredEther, setEnteredEther] = useState('')

  useEffect(async () => {
    console.log(ctx.web3)
    if (ctx.web3) {
      // set contract
      const localContract = new ctx.web3.eth.Contract(JSON.parse(abi), address)
      setContract(localContract)
      // set manager
      const managerAddress = await localContract.methods.manager().call() // dont need to specify from: accounts[0] bc first account is used when working with meta mask
      setManager(managerAddress)
      // set players
      const playersList = await localContract.methods.getPlayers().call()
      setPlayers(playersList)
      // set total ether
      const contractWei = await ctx.web3.eth.getBalance(localContract.options.address)
      const contractEther = ctx.web3.utils.fromWei(contractWei)
      setTotalEther(contractEther)
    }
  }, [ctx.web3])

  const enterLotteryHandler = async () => {
    const accounts = await ctx.onGetAccounts()
    await contract.methods.enter().send({
      from: accounts[0],
      value: ctx.web3.utils.toWei(enteredEther, 'ether')
    })
    setEnteredEther('')
  }

  const enteredEtherChangeHandler = (e) => {
    setEnteredEther(e.target.value)
  }

  return (
    <div className='flex flex-col h-screen' >
      <div className='flex justify-between items-center py-5 px-10 bg-white shadow'>
        <div className='flex items-center' >
          <img src="/mountain-logo.png" alt="Logo" width='48' />
          <h1 className='text-gray-800 text-xl pl-4' >Lottery</h1>
        </div>
        <div className='flex' >
          <MetaMaskBtn />
          <PickWinnerBtn accounts={ctx.accounts} manager={manager} />
        </div>
      </div>
      <div className='flex-grow flex flex-col justify-center items-center' >
        <p className='text-gray-600 text-sm mb-2' >&nbsp;</p>
        <h1 className='text-5xl text-blue-600 ' >Want to try your luck?</h1>
        <p className='mt-4 text-gray-600' >{players && players.length} people entered, competing to win {totalEther} ether</p>
        <div className='flex items-center mt-10' >
          <input type="text" placeholder='Amount in Ether' value={enteredEther} onChange={enteredEtherChangeHandler} className='px-4 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-gray-600 transition ease-in duration-100' style={{ width: 400, height: 50 }} />
          <button onClick={enterLotteryHandler} className='px-2 border-2 border-blue-600 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:bg-blue-700 transition ease-in duration-100' style={{ height: 50 }} >Enter</button>
        </div>
        <p className='text-gray-600 text-sm mt-2' >&nbsp;</p>
      </div>

    </div>
  )
}

const MetaMaskBtn = () => {
  const ctx = useContext(Web3Context)

  if (ctx.connection !== null)
    return (
      <button onClick={ctx.onClickMetaMaskBtn} className='px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50 transition ease-in duraiton-100' style={{ height: 40 }} >
        {ctx.connection === 'NOT INSTALLED' && 'Install MetaMask Here'}
        {ctx.connection === 'DISCONNECTED' && 'Connect to MetaMask'}
        {ctx.connection === 'CONNECTED' && 'Connected to MetaMask'}
      </button>
    )
}


const PickWinnerBtn = ({ accounts, manager }) => {

  const pickWinnerHandler = async () => {
    const accounts = await ctx.onGetAccounts()
    await contract.methods.pickWinner().send({ from: accounts[0] })
  }

  const enabledClasses = 'bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:ring focus:ring-red-400 focus:ring-opacity-50'
  const disabledClasses = 'bg-gray-200 cursor-default focus:outline-none'
  const btnClasses = accounts[0] !== manager ? enabledClasses : disabledClasses

  if (manager === null) {
    // loading
    return (
      <div style={{ width: 40, height: 40 }} className='ml-4' ></div>
    )
  }

  return (
    <button onClick={pickWinnerHandler} className={`ml-4 rounded-lg transition ease-in duration-100 ${btnClasses}`} style={{ width: 40, height: 40 }} >
      <FontAwesomeIcon icon={faTrophy} className='text-white' />
    </button>
  )
}


export default HomePage

// dark mode btn :
//   <button className = 'bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring focus:ring-black focus:ring-opacity-25  transition ease-in duration-100' style = {{ width: 40, height: 40 }} >
//     <FontAwesomeIcon icon={faMoon} className='text-white' />
//   </button >