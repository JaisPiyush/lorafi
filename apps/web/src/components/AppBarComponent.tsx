import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

import { useMyAlgoConnect } from '../hooks/useMyAlgoConnect';

import CustomWalletDetailComponent from './CustomWalletDetailComponent';
import { useAppSelector } from '../hooks/store';
import { useDispatch } from 'react-redux';
import { accountActions } from '../store/account';
import { globalActions } from '../store/global';





function AppBarComponent() {
  const myAlgoConnect = useMyAlgoConnect();
  const [address, isConnected, tab] = useAppSelector(state => [state.account.address, state.account.isConnected, state.global.tab]);
  const dispatch = useDispatch()

  const handleOnTabClick = (tab: 'portal' | 'swap' | 'mint') => {
    dispatch(globalActions.setTab(tab));
  }

  // Check if wallet is already connected and trigger wallet connection upon no connected wallet
  // TODO(store): Account store to save connected wallet data and connection status
  const handleOnConnectWallet = async () => {
    if (isConnected) return;
    const accountsSharedByUser = await myAlgoConnect.connect({
      shouldSelectOneAccount: true
    });
    dispatch(accountActions.setAddress(accountsSharedByUser[0].address))

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
            <Button onClick={() => {handleOnTabClick('portal')}} color={tab === 'portal' ? 'primary': 'inherit'}>Portal</Button>
            <Button onClick={() => {handleOnTabClick('swap')}} color={tab === 'swap' ? 'primary': 'inherit'}>Swap</Button>
            <Button onClick={() => {handleOnTabClick('mint')}} color={tab === 'mint' ? 'primary': 'inherit'}>Mint</Button>
          </Box>

          {/* Button at the right end */}
          {
            (!isConnected) ? <Button color="inherit" onClick={() => {handleOnConnectWallet()}}>Connect Wallet</Button>:
            <CustomWalletDetailComponent onClose={() => {
              dispatch(accountActions.setAddress(undefined))
            }} address={address || ''} />
          }
        </Box>

      </Toolbar>
    </AppBar>
  );
}
export default AppBarComponent;