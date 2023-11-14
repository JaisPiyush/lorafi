import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';
import CustomInputComponent from './CustomInputComponent';
import { useState } from 'react';
import CustomWalletDetailComponent from './CustomWalletDetailComponent';
import { chainsRecord, Chains, tokensRecord, Tokens } from '../constant';
import { useSDK } from '@metamask/sdk-react';
import { useAppDispatch } from '../hooks/store';
import { globalActions } from '../store/global';

//TODO(fix): Implement MyAlgoAccount Provider
//TODO(feat): Add functionality to PORT button 

function PortalComponet() {


  const getAvatar = (chain: Chains) => {
    const chainData = chainsRecord[chain];
    return chainData.url
  }

  const aDai = tokensRecord[Tokens.aDai];

  const [fromChain, setFromChain] = useState<Chains>(Chains.Polygon);
  const [toChain, setToChain] = useState<Chains>(Chains.Algorand)
  const [amount, setAmount] = useState<string>('0')
  
  const { sdk, connected} = useSDK();
  const [address, setAddress] = useState<string>(sdk?.activeProvider?.selectedAddress || '')
  const dispatch = useAppDispatch()

  const handleInput = (t: string) => {
    setAmount(t)
    if (address) {
      dispatch(globalActions.setAlert({
        msg: 'insufficient balance',
        type: 'error'
      }))
    }
  }


  const handleOnConnectWallet = async () => {
    try {
      const accounts = (await sdk?.connect()) as string[];
      // console.log(accounts)
      setAddress(accounts[0]);
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  }

  const handleOnCutClick = () => {
    if (fromChain === Chains.Polygon) {
      sdk?.terminate()
    } else {
      setAddress('')
    }
  }

  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "40vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <Avatar src={getAvatar(fromChain)} alt="Avatar 1" sx={{ width: 60, height: 60 }} />
            <IconButton color="primary">
              <SwapHorizIcon onClick={() => {
                const _currentFromChain = fromChain;
                setFromChain(toChain);
                setToChain(_currentFromChain)
              }} />
            </IconButton>
            <Avatar src={getAvatar(toChain)} alt="Avatar 2" sx={{ width: 60, height: 60 }} />
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <CustomInputComponent 
              avatarSrc={aDai.url}
              label={aDai.symbol}
              placeholder='0'
              onInput={handleInput}
              value={amount}
            />
          </Stack>
          {
            connected || fromChain === Chains.Algorand ? <Stack sx={{ width: "100%", overflow: "hidden", justifyContent: "center" }}>
              <Typography>{fromChain === Chains.Polygon ? "FROM" : "TO"}</Typography>
            </Stack> : <></>
          }
          {connected || fromChain === Chains.Algorand ?
            <Stack sx={{ width: "100%", justifyContent: "center" }}>
              <CustomWalletDetailComponent 
                onClose={() => {handleOnCutClick()}} 
                address={address} 
                disabled={fromChain === Chains.Polygon} 
                onInput={setAddress} 
                placeholder='Address'
              />
            </Stack> : <>
            </>
          }

          <Stack sx={{}}>
            <Button variant="contained" color="primary" onClick={() => {handleOnConnectWallet()}}>
              {connected || fromChain === Chains.Algorand ? "Port" : "Connect Wallet"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default PortalComponet