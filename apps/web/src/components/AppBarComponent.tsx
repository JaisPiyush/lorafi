import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

import { useMyAlgoConnect } from '../hooks/useMyAlgoConnect';
import { useState } from 'react';
import CustomWalletDetailComponent from './CustomWalletDetailComponent';





function AppBarComponent() {
  const myAlgoConnect = useMyAlgoConnect();
  const [hasConnected, setHasConnected] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('')

  // Check if wallet is already connected and trigger wallet connection upon no connected wallet
  // TODO(store): Account store to save connected wallet data and connection status
  const handleOnConnectWallet = async () => {
    if (hasConnected) return;
    const accountsSharedByUser = await myAlgoConnect.connect({
      shouldSelectOneAccount: true
    });
    setHasConnected(true)
    setAddress(accountsSharedByUser[0].address)

  }

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>


      <Toolbar>
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          {/* Logo at the left end */}
          <Typography variant="h6" component="div" sx={{ padding: 1, marginRight: 5 }} >
            Logo
          </Typography>

          {/* Three buttons in the center */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <Button color="inherit">Portal</Button>
            <Button color="inherit">Swap</Button>
            <Button color="inherit">Mint</Button>
          </Box>

          {/* Button at the right end */}
          {
            (!hasConnected) ? <Button color="inherit" onClick={() => {handleOnConnectWallet()}}>Connect Wallet</Button>:
            <CustomWalletDetailComponent onClose={() => {
              setHasConnected(false)
              setAddress('')
            }} address={address} />
          }
        </Box>

      </Toolbar>
    </AppBar>
  );
}
export default AppBarComponent;