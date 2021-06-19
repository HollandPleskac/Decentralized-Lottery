import '../styles/globals.css'
import { Web3ContextProvider } from '../context/web3Context'
import { LotteryContextProvider } from '../context/lotteryContext'

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <LotteryContextProvider>
        <Component {...pageProps} />
      </LotteryContextProvider>
    </Web3ContextProvider>
  )
}

export default MyApp
