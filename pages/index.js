// got address and abi from remix editor
const address = '0x42cE7979e69980164dF85ebA7DE728296Bd9465E'
const abi = `
[
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pickWinner",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getPlayers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

import React, { useContext, useState, useEffect } from 'react'
import Web3Context from '../context/web3Context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from 'next/router'

const HomePage = () => {
  const ctx = useContext(Web3Context)

  const [contract, setContract] = useState(null)
  const [manager, setManager] = useState(null)
  const [players, setPlayers] = useState(null)
  const [totalEther, setTotalEther] = useState(null)

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



  return (
    <div className='flex flex-col h-screen' >
      <div className='flex justify-between items-center py-5 px-10 bg-white shadow'>
        <div className='flex items-center' >
          <img src="/mountain-logo.png" alt="Logo" width='48' />
          <h1 className='text-gray-800 text-xl pl-4' >Lottery</h1>
        </div>
        <div className='flex' >
          <MetaMaskBtn />
          <PickWinnerBtn manager={manager} contract={contract} />
        </div>
      </div>
      <div className='flex-grow flex flex-col justify-center items-center' >
        {ctx.connection === 'CONNECTED' && <ConnectedContent players={players} totalEther={totalEther} contract={contract} />}
        {ctx.connection === 'DISCONNECTED' && <DisconnectedContent />}
        {ctx.connection === 'NOT INSTALLED' && <MetaMaskNotInstalledContent />}

      </div>

    </div>
  )
}


const ConnectedContent = ({ players, totalEther, contract }) => {
  const ctx = useContext(Web3Context)

  const [enteredEther, setEnteredEther] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const enterLotteryHandler = async () => {

    if (isNaN(enteredEther)) {
      setFeedback('Ether entered must be a number!')
      return
    } else if (enteredEther <= 0.1) {
      setFeedback('Ether entered must be greater than 0.1!')
      return
    }

    const accounts = ctx.accounts
    setLoading(true)
    try {
      await contract.methods.enter().send({
        from: accounts[0],
        value: ctx.web3.utils.toWei(enteredEther, 'ether')
      })
      setFeedback('')
    } catch (e) {
      setFeedback(e.message.replace('MetaMask Tx Signature: ', '').replace('.', ''))
    }
    setEnteredEther('')
    setLoading(false)
  }

  const enteredEtherChangeHandler = (e) => {
    setEnteredEther(e.target.value)
  }

  return (
    <>
      <p className='text-gray-600 text-sm mb-2' >&nbsp;</p>
      <h1 className='text-5xl text-blue-600 ' >Want to try your luck?</h1>
      <p className='mt-4 text-gray-600' >{(players && players.length) || 0} people entered, competing to win {totalEther || 0} ether</p>
      <div className='flex items-center mt-10' >
        <EtherInput value={enteredEther} changeHandler={enteredEtherChangeHandler} loading={loading} />
        <EnterBtn enterLottery={enterLotteryHandler} loading={loading} />
      </div>
      {
        feedback === ''
          ? <p className='text-gray-600 text-sm mt-2' >&nbsp;</p>
          : <p className='text-gray-600 text-sm mt-2' >{feedback}</p>
      }
    </>
  )
}


const DisconnectedContent = () => {
  return (
    <p className='text-gray-800 text-lg' >Connect to MetaMask by clicking the button in the top right corner!</p>
  )
}


const MetaMaskNotInstalledContent = () => {
  const router = useRouter()

  const installHandler = () => {
    router.push('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
  }


  return (
    <button onClick={installHandler} className='bg-blue-600 text-white rounded-lg px-8 py-3 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50 transition ease-in duraiton-100' >
      Install MetaMask to Continue
    </button>
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


const PickWinnerBtn = ({ manager, contract }) => {
  const ctx = useContext(Web3Context)

  console.log('_')
  console.log('accounts[0]', ctx.accounts[0])
  console.log('manager', manager)
  console.log('are equal', parseFloat(ctx.accounts[0]) === parseFloat(manager))


  const pickWinnerHandler = async () => {
    const accounts = ctx.accounts
    await contract.methods.pickWinner().send({ from: accounts[0] })
  }

  // not connected
  if (manager === null || parseFloat(ctx.accounts[0]) !== parseFloat(manager))
    return (
      <div></div>
    )

  return (
    <button onClick={pickWinnerHandler} className='ml-4 rounded-lg bg-red-700 hover:bg-red-800 focus:outline-none focus:ring focus:ring-red-400 focus:ring-opacity-50 transition ease-in duration-100' style={{ width: 40, height: 40 }} >
      <FontAwesomeIcon icon={faTrophy} className='text-white' />
    </button>
  )
}


const EtherInput = ({ loading, value, changeHandler }) => {

  const disabledClasses = 'bg-gray-50'
  const inputClasses = loading ? disabledClasses : ''

  return (
    <input
      readOnly={loading}
      type="text"
      placeholder='Amount in Ether'
      value={value}
      onChange={changeHandler}
      className={`px-4 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-gray-600 transition ease-in duration-100 ${inputClasses}`}
      style={{ width: 400, height: 50 }}
    />
  )
}


const EnterBtn = ({ enterLottery, loading }) => {

  const enabledClasses = 'border-blue-600 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:bg-blue-700 '
  const disabledClasses = 'border-gray-500 bg-gray-500 cursor-default'
  const btnClasses = loading ? disabledClasses : enabledClasses

  return (
    <button
      disabled={loading}
      onClick={enterLottery}
      className={`flex items-center px-2 border-2 rounded-r-lg transition ease-in duration-100 ${btnClasses}`}
      style={{ height: 50 }}
    >
      {
        loading ? <ClipLoader color={'#fff'} size={23} /> : 'Enter'
      }
    </button>
  )
}



export default HomePage

// dark mode btn :
//   <button className = 'bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring focus:ring-black focus:ring-opacity-25  transition ease-in duration-100' style = {{ width: 40, height: 40 }} >
//     <FontAwesomeIcon icon={faMoon} className='text-white' />
//   </button >