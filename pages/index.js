// architecture

/*

onClick pick winner:
  request random number
  start loading

fulfill randomness function
  emit event (pick winner)

listening for events {
  
  onPickWinner {
    return value of winner(index)
    pickWinner(index -> send money to winner)
    end loading
  }

}

*/



// got address and abi from remix editor
const address = '0x85369d293Df303b5D4f886C40ba8676363711FfF'
const abi = `
[
	{
		"inputs": [],
		"name": "emitEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "randomness",
				"type": "uint256"
			}
		],
		"name": "rawFulfillRandomness",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PickingWinnerEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "randomNum",
				"type": "uint256"
			}
		],
		"name": "pickWinner",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "requestRandomNumber",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "winnerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "numberOfPlayers",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "weiAmount",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "WinnerChosenEvent",
		"type": "event"
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
	},
	{
		"inputs": [],
		"name": "randomResult",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "state",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

import React, { useContext, useState, useEffect } from 'react'
import Web3Context from '../context/web3Context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faTimes } from '@fortawesome/free-solid-svg-icons'
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
  const [contractState, setContractState] = useState('')

  const [showPopup, setShowPopup] = useState(false)
  const [winnerData, setWinnerData] = useState(null)

  useEffect(async () => {

    const initialContractState = await contract.methods.state().call()
    console.log('initial state', initialContractState)
    setContractState(initialContractState)

    const pickingWinnerEventSubscription = contract.events.PickingWinnerEvent({ fromBlock: 'latest' })
      .on('data', async event => {
        const beforeState = await contract.methods.state().call()
        console.log('state before picking winner', beforeState)
        setContractState(beforeState)

        const randomNumber = await contract.methods.randomResult().call()
        console.log('random number', randomNumber)
        await contract.methods.pickWinner(randomNumber).send({ from: ctx.accounts[0] })
      })

    const winnerChosenEventSubscription = contract.events.WinnerChosenEvent({ fromBlock: 'latest' })
      .on('data', async event => {
        console.log('winner was chosen!! event =>', event.returnValues)
        setWinnerData({
          address: event.returnValues.winnerAddress,
          etherAmount: ctx.web3.utils.fromWei(event.returnValues.weiAmount),
          numberOfPlayers: event.returnValues.numberOfPlayers,
          timestamp: event.returnValues.timestamp
        })

        const afterState = await contract.methods.state().call()
        console.log('state after picking winner', afterState)
        setShowPopup(true)
        setContractState(afterState)
      })


    return async () => {
      await pickingWinnerEventSubscription.unsubscribe()
      await winnerChosenEventSubscription.unsubscribe()
    }
  }, [])

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

  const listenHandler = async () => {
    console.log('listening for events')
    const subscription = contract.events.MyEvent({ fromBlock: 'latest' }).on('data', event => console.log('new event', event))
    console.log('Subscription', subscription)
    setSub(subscription)
  }

  const emitHandler = async () => {
    await contract.methods.emitEvent().send({ from: ctx.accounts[0] })
  }

  const unsubscribeHandler = async () => {
    await sub.unsubscribe((error, success) => {
      if (success)
        console.log('Successfully unsubscribed!');
      else
        console.log('Error unsubscribing', error)
    })
  }

  const exitPopupHandler = () => {
    setShowPopup(false)
  }


  if (contractState === 'Picking Winner')
    return <PickingWinnerContent />

  return (
    <>
      <button onClick={() => { setShowPopup(true) }} >show popup</button>
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
      <button onClick={listenHandler} >
        Click to listen to events
      </button>
      <button onClick={emitHandler} >Emit a new event</button>
      <button onClick={unsubscribeHandler} >unsubscribe</button>
      {showPopup && <WinnerPopup exitHandler={exitPopupHandler} address={winnerData.address} playersEntered={winnerData.numberOfPlayers} etherWon={winnerData.etherAmount} />}
    </>
  )
}


const DisconnectedContent = () => {
  return (
    <p className='text-gray-800 text-lg' >Connect to MetaMask by clicking the button in the top right corner!</p>
  )
}

const PickingWinnerContent = () => {
  return (
    <div>
      Picking a winner...
    </div>
  )
}

const WinnerPopup = ({ exitHandler, address, playersEntered, etherWon }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center' >
      <div className='relative bg-white p-6 rounded-lg transition ease-in duration-200' >
        <FontAwesomeIcon onClick={exitHandler} icon={faTimes} className='absolute right-3 top-3 cursor-pointer' />
        <h1 className='mb-2 text-xl text-center text-gray-800' >Winner Chosen</h1>
        <p className='mb-2' >{address}</p>
        <div className='flex items-center mb-2' >
          <div className='mr-2 px-2 py-1 rounded-full bg-blue-600 text-white flex justify-center items-center' style={{ width: 35, height: 35 }} >{playersEntered}</div>
          <p>Players entered</p>
        </div>
        <div className='flex items-center' >
          <div className='mr-2 px-2 py-1 rounded-full bg-blue-600 text-white flex justify-center items-center' style={{ width: 35, height: 35 }} >{etherWon}</div>
          <p>Ether won</p>
        </div>
      </div>
    </div>
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

  const pickWinnerHandler = async () => {
    const accounts = ctx.accounts
    // request a random number
    console.log('requesting a random number')
    await contract.methods.requestRandomNumber().send({ from: accounts[0] })
  }

  // not connected (only way to check if addresses are definitively equal to to convert both addresses (strings) to lower case characters)
  if (manager === null || !ctx.accounts[0] || ctx.accounts[0].toLowerCase() !== manager.toLowerCase())
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