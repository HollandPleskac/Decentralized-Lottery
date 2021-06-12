import React, { useState, useEffect } from 'react'
import Web3 from "web3";

const HomePage = () => {
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState('')
  const [web3, setWeb3] = useState({})
  const [lottery, setLottery] = useState({})
  const [value, setValue] = useState(0)
  const [feedback, setFeedback] = useState('')

  const address = '0xBe57df6d9cAf41a41827F2294D46380954bB58e8'
  const abi = '[{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'

  useEffect(async () => {

    // connect to meta mask
    window.ethereum.request({ method: "eth_requestAccounts" });
    const web3 = new Web3(window.ethereum);
    console.log(web3)
    setWeb3(web3)

    // make local contract instance
    const lottery = new web3.eth.Contract(JSON.parse(abi), address)
    console.log(lottery)
    setLottery(lottery)

    const manager = await lottery.methods.manager().call() // called on first metamask account (dont need a from property in call() fn)
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    setManager(manager)
    setPlayers(players)
    setBalance(balance)

  }, [])

  const onSubmitHandler = async (e) => {
    console.log('entering into contract')
    e.preventDefault()
    if (Object.keys(lottery).length !== 0) {
      // enter into contract
      const accounts = await web3.eth.getAccounts()
      setFeedback('Waiting on transaction success...')
      await lottery.methods.enter().send({ // 15 to 30 seconds to process
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      })
      setFeedback('You have been entered!')
    }
  }

  const pickWinnerHandler = async (e) => {
    console.log('picking a winner')
    if (Object.keys(lottery).length !== 0) {
      const accounts = await web3.eth.getAccounts()
      setFeedback('Waiting on transaction success...')
      await lottery.methods.pickWinner().send({ from: accounts[0] })
      setFeedback('A winner has been picked!')
    }
  }


  return (
    <div className='flex flex-col h-screen justify-center items-center' >
      <h2 className='font-bold text-lg mb-1' >Lottery Contract</h2>
      <p>
        This contract is managed by {manager}.
        There are currently {players.length} people entered,
        competing to win {Object.keys(web3).length === 0 ? '' : web3.utils.fromWei(balance)} ether!
      </p>
      <hr />
      <form onSubmit={onSubmitHandler} >
        <h4 className='font-bold' >Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className='border-2 border-gray-800 ml-2'
          />
        </div>
        <button className='border-2 border-gray-800 px-4' >Enter</button>
      </form>
      <hr />
      <h4 className='font-bold' >Ready to pick a winner?</h4>
      <button className='border-2 border-gray-800 px-4' onClick={pickWinnerHandler} >Pick a winner!</button>
      <hr />
      <h1>{feedback}</h1>
    </div>
  )
}

export default HomePage
