import { Paper, Button } from '@mui/material'

const AppLandingCompoent = () => {
  return (
    <div>
      <Paper elevation={5} sx={{ height: "30vh", margin: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Button variant="contained" sx={{ backgroundColor: 'black' }}>
          Connect Wallet
        </Button>
      </Paper>
    </div>
  )
}

export default AppLandingCompoent
