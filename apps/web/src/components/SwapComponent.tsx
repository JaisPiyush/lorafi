/* eslint-disable @typescript-eslint/no-explicit-any */
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import CustomDropdownInput from './CustomDropdownInput';
import { useState } from 'react';
import { Tokens, poolAssets, tokensRecord } from '../constant';
import { useAppDispatch } from '../hooks/store';
import { globalActions } from '../store/global';


const getAssetOut = (token: Tokens) => {
  const assetOuts = poolAssets[token]
  return assetOuts.map(asset => {
    const token = tokensRecord[asset.token]
    return {
      value: token.symbol,
      label: token.name,
      image: <img height={'30px'} src={token.url} />
    }
  })
}

const getAssetIn = () => {
  const tokens = Object.keys(poolAssets);
  return tokens.map((asset) => {
    const token = tokensRecord[asset]
    return {
      value: token.symbol,
      label: token.name,
      image: <img height={'30px'} src={token.url} />
    }
  })
}


function SwapComponent() {

  const [assetIn, setAssetIn] = useState(Tokens.PT_aDai);
  const [assetOut, setAssetOut] = useState(Tokens.YT_aDai);
  const [assetInAmount, setAssetInAmount] = useState('0');
  const [assetOutAmount, setAssetOutAmount] = useState('0');

  const dispatch = useAppDispatch()

  const handleOnSwap = () => {
    dispatch(globalActions.setAlert({
      msg: 'insufficient balance',
      type: 'error'
    }))
  }

  const onFlipClick = () => {
    // const _assetOut = assetIn
    // setAssetIn(assetOut);
    // setAssetOut(_assetOut)
  }

  const handleOnInput = (t: string) => {
    setAssetInAmount(t);
    dispatch(globalActions.setAlert({
      msg: 'insufficient balance',
      type: 'error'
    }))
  }


  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "30vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomDropdownInput 
              key='amount-in'
              value={assetIn} 
              onChange={(a) => {setAssetIn(a as any) }} 
              style={{ width: "100%" }} 
              options={getAssetIn()}   
              amount={assetInAmount}
              onInput={handleOnInput}
              disabled={false}
            />
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <IconButton onClick={() => {onFlipClick()}} color="primary">
              <SwapVertIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomDropdownInput 
              key='amount-out'
              value={assetOut} 
              disabled={true} 
              onChange={() => { }} 
              style={{ width: "100%" }} 
              options={getAssetOut(assetIn)} 
              amount={assetOutAmount}
            />
          </Stack>
          <Stack sx={{mt: 2}}>
            <Button onClick={() => {handleOnSwap()}} variant="contained" color="primary" >
              Swap
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default SwapComponent