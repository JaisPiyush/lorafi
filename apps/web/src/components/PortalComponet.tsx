import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';
import CustomInputCompoent from './CustomInputCompoent';
import { useState } from 'react';
import CustomWalletDetailComponent from './CustomWalletDetailComponent';


function PortalComponet() {

  const [walletConnected, setwalletConnected] = useState(false);
  const [tokenSwapped, setTokenSwapped] = useState(false);

  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "40vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <Avatar src="/path-to-avatar-1.jpg" alt="Avatar 1" sx={{ width: 60, height: 60 }} />
            <IconButton color="primary">
              <SwapHorizIcon onClick={() => {
                setTokenSwapped(!tokenSwapped)
              }} />
            </IconButton>
            <Avatar src="/path-to-avatar-2.jpg" alt="Bvatar 2" sx={{ width: 60, height: 60 }} />
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <CustomInputCompoent />
          </Stack>
          {
            walletConnected ? <Stack sx={{ width: "100%", overflow: "hidden", justifyContent: "center" }}>
              <Typography>{!tokenSwapped ? "FROM" : "TO"}</Typography>
            </Stack> : <></>
          }
          {walletConnected ?
            <Stack sx={{ width: "100%", justifyContent: "center" }}>
              <CustomWalletDetailComponent />
            </Stack> : <>
            </>
          }

          <Stack sx={{}}>
            <Button variant="contained" color="primary" onClick={() => {setwalletConnected(!walletConnected)}}>
              {walletConnected ? "Port" : "Connect Wallet"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default PortalComponet