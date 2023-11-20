import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import CustomInputComponent from './CustomInputComponent';
import { Tokens, tokensRecord } from '../constant';
import { useEffect, useState } from 'react';
import { useMyAlgoConnect } from '../hooks/useMyAlgoConnect';

import { useAppDispatch, useAppSelector } from '../hooks/store';

import { burnYieldTokens, mintYieldTokens } from '../contract_calls/lora';
import { globalActions } from '../store/global';
import { ArrowUpward } from '@mui/icons-material';
// import { getGlobalStateOfPool } from '../contract_calls/pool';

function MintComponet() {
  const aDai = tokensRecord[Tokens.aDai];
  const ptADai = tokensRecord[Tokens.PT_aDai];
  const ytADai = tokensRecord[Tokens.YT_aDai];
  const [amountIn, setAmountIn] = useState<string>('0');
  const [toYieldToken, setToYieldToken] = useState<boolean>(true)
  // const [ptAmountOut, setPtAmountOut] = useState<string>('0');
  // const [ytAmountOut, setYtAmountOut] = useState<string>('0');


  const [address, isConnected] = useAppSelector(state => [state.account.address, state.account.isConnected])
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isConnected) {
      // myAlgoConnect.connect().then((acc): void => {
      //   dispatch(accountActions.setAddress(acc[0].address))
      // });
    }
  }, [isConnected])

  const myAlgoConnect = useMyAlgoConnect();

  const getPtAmountOut = () => {
    if (!toYieldToken) {
      return amountIn;
    }
    return parseInt((parseInt(amountIn || '0') * (1-0.025)).toString()).toString()
  }

  const getYtAmountOut = () => {
    return parseInt((parseInt(amountIn || '0') * 0.025).toString()).toString()
  }

  
  const mint = async () => { 
    if (parseInt(amountIn) > 0 && address) {
      await mintYieldTokens(
        address as string,
        myAlgoConnect,
        parseInt(amountIn)
      );
      dispatch(globalActions.setAlert({
        msg: 'minting successful',
        type: 'success'
      }))
    }

  
  }

  const burn = async () => {
    if (parseInt(amountIn) > 0 && address) {
      await burnYieldTokens(
        address as string,
        myAlgoConnect,
        parseInt(amountIn)
      );
      dispatch(globalActions.setAlert({
        msg: 'converted',
        type: 'success'
      }))
    }
  }

  const handleOnAmountInput = (s: string) => {
    setAmountIn(s)
  }

  const getaDaiAmount = () => {
    if (toYieldToken) {
      return amountIn;
    }
    const yt = parseInt(((parseInt(amountIn) * 0.0025)/ (1-0.0025)).toString());
    return (yt  + parseInt(amountIn)).toString()
  }

  const handleOnBtnClick = async () => {
    try {
      if (toYieldToken) {
        await mint()
      } else {
        await burn()
      }
    } catch (e) {
      dispatch(globalActions.setAlert({
        msg: 'unknown error in txn',
        type: 'error'
      }))
    }
  }

  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "40vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputComponent
              avatarSrc={aDai.url}
              label={aDai.symbol}
              value={getaDaiAmount()}
              onInput={handleOnAmountInput}
              placeholder='Enter amount'
              disabled={!toYieldToken}
            />
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <IconButton color="primary" onClick={() => {setToYieldToken(!toYieldToken)}}>
              {toYieldToken ? <ArrowDownwardIcon />: <ArrowUpward />}
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputComponent
              avatarSrc={ptADai.url}
              label={ptADai.symbol}
              disabled={toYieldToken}
              value={getPtAmountOut()}
              onInput={handleOnAmountInput}
            />
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputComponent
              avatarSrc={ytADai.url}
              label={ytADai.symbol}
              disabled={true}
              value={getYtAmountOut()}
            />
          </Stack>
          <Stack sx={{}}>
            <Button onClick={() => {handleOnBtnClick()}} variant="contained" color="primary" >
              {toYieldToken ? 'Mint': 'Redeem'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default MintComponet