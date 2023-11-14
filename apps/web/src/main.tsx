import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { Provider } from 'react-redux'
import store from "./store/store.ts"


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MetaMaskProvider debug={false} sdkOptions={{
          checkInstallationImmediately: false,
          dappMetadata: {
            name: "LoraFi",
            url: window.location.host,
          }
        }}>
          <App />
      </MetaMaskProvider>
    </Provider>
  </React.StrictMode>,
)
