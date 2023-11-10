import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import CustomInputCompoent from './CustomInputCompoent';

function MintComponet() {
  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "40vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputCompoent/>
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <IconButton color="primary">
              <ArrowDownwardIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputCompoent/>
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomInputCompoent/>
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