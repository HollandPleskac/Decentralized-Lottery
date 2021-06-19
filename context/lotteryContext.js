import React, { useEffect, useState, useContext } from 'react'
import Web3 from 'web3'
import Web3Context from './web3Context'

const LotteryContext = React.createContext({

})

export const LotteryContextProvider = (props) => {
  const web3Ctx = useContext(Web3Context)

  const getContractManager = () => {

  }

  const enterLottery = () => {

  }

  const pickWinner = () => {

  }

  const getPlayers = () => {

  }

  return (
    <LotteryContext.Provider value={{
      //  values
    }} >
      {props.children}
    </LotteryContext.Provider>
  )

}

export default LotteryContext