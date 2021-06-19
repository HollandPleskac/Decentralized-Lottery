import React, { useEffect, useState } from 'react'
import Web3 from 'web3'

const Web3Context = React.createContext({
  web3: null,
  connection: '',
  onClickMetaMaskBtn: async () => { },
  onGetAccounts: async () => { }
})

export const Web3ContextProvider = (props) => {
  const [connection, setConnection] = useState('')
  const [web3, setWeb3] = useState(null)

  const isMetaMaskInstalled = async () => {
    return ethereum && ethereum.isMetaMask
  }

  const isMetaMaskConnected = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0)
      return true
    return false
  }

  useEffect(async () => {

    if (await isMetaMaskInstalled()) {

      // initial connection state
      if (await isMetaMaskConnected()) {
        setWeb3(new Web3(window.ethereum))
        setConnection('CONNECTED')
      } else {
        setWeb3(null)
        setConnection('DISCONNECTED')
      }

      // listen for connection state changes         source: https://docs.metamask.io/guide/ethereum-provider.html#events => Events => accountsChanged
      window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length !== 0) {
          setWeb3(new Web3(window.ethereum))
          setConnection('CONNECTED')
        } else {
          setWeb3(null)
          setConnection('DISCONNECTED')
        }
      })

    } else
      setConnection('NOT INSTALLED')

  }, [])

  const metaMaskBtnHandler = async () => {
    if (connection === 'DISCONNECTED')
      await window.ethereum.request({ method: "eth_requestAccounts" })
    else if (connection === 'NOT INSTALLED')
      router.push('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
    else if (connection === 'CONNECTED')
      console.log('Uninstall meta mask by clicking on the chrome extension')
  }

  const getAccounts = async () => {
    const accounts = await web3.eth.getAccounts()
    return accounts
  }


  return (
    <Web3Context.Provider value={{
      web3: web3,
      connection: connection,
      onClickMetaMaskBtn: metaMaskBtnHandler,
      onGetAccounts: getAccounts
    }} >
      {props.children}
    </Web3Context.Provider>
  )

}

export default Web3Context