import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';



function AppBarComponent() {

  const handleOnConnectWallet = () => {}

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
          <Button color="inherit" onClick={() => {handleOnConnectWallet()}}>Connect Wallet</Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
export default AppBarComponent;