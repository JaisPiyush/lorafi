import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import CustomInputComponent from './CustomInputComponent';
import { Tokens, tokensRecord } from '../constant';
import { useState } from 'react';
// import { getGlobalStateOfPool } from '../contract_calls/pool';

function MintComponet() {
  const aDai = tokensRecord[Tokens.aDai];
  const ptADai = tokensRecord[Tokens.PT_aDai];
  const ytADai = tokensRecord[Tokens.YT_aDai];
  const [amountIn, setAmountIn] = useState<string>('0');
  const [ptAmountOut, setPtAmountOut] = useState<string>('0');
  const [ytAmountOut, setYtAmountOut] = useState<string>('0');

  const handleOnAmountInput = (s: string) => {
    setAmountIn(s)
  }

  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "40vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputComponent
              avatarSrc={aDai.url}
              label={aDai.symbol}
              value={amountIn}
              onInput={handleOnAmountInput}
              placeholder='Enter amount'
            />
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <IconButton color="primary">
              <ArrowDownwardIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputComponent
              avatarSrc={ptADai.url}
              label={ptADai.symbol}
              disabled={true}
              value={ptAmountOut}
            />
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputComponent
              avatarSrc={ytADai.url}
              label={ytADai.symbol}
              disabled={true}
              value={ytAmountOut}
            />
          </Stack>
          <Stack sx={{}}>
            <Button variant="contained" color="primary" >
              Mint
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default MintComponet