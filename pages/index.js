// got address and abi from deploying contract Lottery.sol in Lottery Project Ethereum Udemy Course --> deploy.js
// const address = '0xBe57df6d9cAf41a41827F2294D46380954bB58e8'
// const abi = '[{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon } from '@fortawesome/free-solid-svg-icons'

const HomePage = () => {
  return (
    <div className='flex flex-col h-screen' >
      <div className='flex justify-between items-center py-5 px-10 bg-white shadow'>
        <div className='flex items-center' >
          <img src="/mountain-logo.png" alt="Logo" width='48' />
          <h1 className='text-gray-800 text-xl pl-4' >Lottery</h1>
        </div>
        <div>
          <button className='px-4 mr-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50 transition ease-in duraiton-100' style={{ height: 40 }} >
            Connect to MetaMask
          </button>
          <button className='bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50  transition ease-in duration-100' style={{ width: 40, height: 40 }} >
            <FontAwesomeIcon icon={faMoon} className='text-white' />
          </button>
        </div>
      </div>
      <div className='flex-grow flex flex-col justify-center items-center' >
        <p className='text-gray-600 text-sm mb-2' >&nbsp;</p>
        <h1 className='text-5xl text-blue-600 ' >Want to try your luck?</h1>
        <p className='mt-4 text-gray-600' >0 people entered, competing to win 0 ether</p>
        <div className='flex items-center mt-9' >
          <input type="text" placeholder='Amount in Ether' className='px-4 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-gray-600 transition ease-in duration-100' style={{ width: 400, height: 50 }} />
          <button className='px-2 border-2 border-blue-600 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:bg-blue-700 transition ease-in duration-100' style={{ height: 50 }} >Enter</button>
        </div>
        <p className='text-gray-600 text-sm mt-2' >&nbsp;</p>
      </div>

    </div>
  )
}

export default HomePage
