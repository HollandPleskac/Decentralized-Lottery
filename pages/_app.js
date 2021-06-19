import '../styles/globals.css'
import { Web3ContextProvider } from '../context/web3Context'

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  )
}

export default MyApp
