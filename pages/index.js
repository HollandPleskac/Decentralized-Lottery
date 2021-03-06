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
const address = '0xFFA25Bd7E0094b02Ae8D2eBd621AdCB443864651'
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
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "playerAddress",
				"type": "address"
			}
		],
		"name": "PlayerEnteredEvent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "setChooseWinnerAutomatically",
		"outputs": [],
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
		"name": "chooseWinnerAutomatically",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
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
import { faTrophy, faTimes, faRobot } from '@fortawesome/free-solid-svg-icons'
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from 'next/router'

const HomePage = () => {
  const ctx = useContext(Web3Context)

  const [contract, setContract] = useState(null)
  const [manager, setManager] = useState(null)

  useEffect(async () => {
    console.log(ctx.web3)
    if (ctx.web3) {
      // set contract
      const localContract = new ctx.web3.eth.Contract(JSON.parse(abi), address)
      setContract(localContract)
      // set manager
      const managerAddress = await localContract.methods.manager().call() // dont need to specify from: accounts[0] bc first account is used when working with meta mask
      setManager(managerAddress)
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
          <AutomaticallyPickWinnerBtn manager={manager} contract={contract} />
        </div>
      </div>
      <div className='flex-grow flex flex-col justify-center items-center' >
        {ctx.connection === 'CONNECTED' && <ConnectedContent contract={contract} />}
        {ctx.connection === 'DISCONNECTED' && <DisconnectedContent />}
        {ctx.connection === 'NOT INSTALLED' && <MetaMaskNotInstalledContent />}
      </div>

    </div>
  )
}


const ConnectedContent = ({ contract }) => {
  const ctx = useContext(Web3Context)

  // local state
  const [enteredEther, setEnteredEther] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  // contract state
  const [contractState, setContractState] = useState('')
  const [players, setPlayers] = useState(null)
  const [totalEther, setTotalEther] = useState(null)

  // data from events
  const [showPopup, setShowPopup] = useState(false)
  const [winnerData, setWinnerData] = useState(null)

  useEffect(async () => {

    // set players
    const playersList = await contract.methods.getPlayers().call()
    setPlayers(playersList)
    // set total ether
    const contractWei = await ctx.web3.eth.getBalance(contract.options.address)
    const contractEther = ctx.web3.utils.fromWei(contractWei)
    setTotalEther(contractEther)

    const initialContractState = await contract.methods.state().call()
    console.log('initial state', initialContractState)
    setContractState(initialContractState)

    const pickingWinnerEventSubscription = contract.events.PickingWinnerEvent({ fromBlock: 'latest' })
      .on('data', async event => {
        const pickingWinnerState = await contract.methods.state().call()
        console.log('picking winner event fired', pickingWinnerState)
        setContractState(pickingWinnerState)
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

        const afterWinnerChosenState = await contract.methods.state().call()
        console.log('state after picking winner', afterWinnerChosenState)
        setShowPopup(true)
        setContractState(afterWinnerChosenState)
      })

    const playerEnteredEventSubscription = contract.events.PlayerEnteredEvent({ fromBlock: 'latest' })
      .on('data', async event => {
        console.log('player entered event logged!!', event)
        // get new players list
        const newPlayersList = await contract.methods.getPlayers().call()
        setPlayers(newPlayersList)
        // get new ether count
        const newContractWei = await ctx.web3.eth.getBalance(contract.options.address)
        const newContractEther = ctx.web3.utils.fromWei(newContractWei)
        setTotalEther(newContractEther)
      })

    return async () => {
      await pickingWinnerEventSubscription.unsubscribe()
      await winnerChosenEventSubscription.unsubscribe()
      await playerEnteredEventSubscription.unsubscribe()
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

  const exitPopupHandler = () => {
    setShowPopup(false)
    setPlayers([])
    setTotalEther(0)
  }

  const emitHandler = async () => {
    await contract.methods.emitEvent().send({ from: ctx.accounts[0] })
  }


  if (contractState === 'Picking Winner')
    return <PickingWinnerContent />

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
      <button onClick={emitHandler} >Emit a new event</button>
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
    return <div></div>

  return (
    <button onClick={pickWinnerHandler} className='ml-4 rounded-lg bg-red-700 hover:bg-red-800 focus:outline-none focus:ring focus:ring-red-400 focus:ring-opacity-50 transition ease-in duration-100' style={{ width: 40, height: 40 }} >
      <FontAwesomeIcon icon={faTrophy} className='text-white' />
    </button>
  )
}

const AutomaticallyPickWinnerBtn = ({ manager, contract }) => {
  const ctx = useContext(Web3Context)
  const [autoPicking, setAutoPicking] = useState(null)

  useEffect(async () => {
    if (contract) {
      const initialAutoPickState = await contract.methods.chooseWinnerAutomatically().call()
      console.log('automatic state', initialAutoPickState)
      setAutoPicking(initialAutoPickState)
    }
  }, [contract])

  const autoPickWinnerHandler = async () => {
    const accounts = ctx.accounts
    console.log('changing auto pick winner')
    await contract.methods.setChooseWinnerAutomatically().send({ from: accounts[0] })
    setAutoPicking(prevState => !prevState)
  }

  // not connected (only way to check if addresses are definitively equal to to convert both addresses (strings) to lower case characters)
  if (manager === null || !ctx.accounts[0] || ctx.accounts[0].toLowerCase() !== manager.toLowerCase())
    return <div></div>

  const activeBtnColorClasses = 'bg-green-700'
  const inactiveBtnColorClasses = 'bg-gray-700'
  const btnColorClasses = autoPicking ? activeBtnColorClasses : inactiveBtnColorClasses

  return (
    <button onClick={autoPickWinnerHandler} className={'ml-4 rounded-lg focus:outline-none transition ease-in duration-100 ' + btnColorClasses} style={{ width: 40, height: 40 }} >
      <FontAwesomeIcon icon={faRobot} className='text-white' />
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