import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import CustomDropdownInput from './CustomDropdownInput';
function SwapComponent() {
  return (
    <Paper elevation={5} sx={{ padding: '16px', textAlign: 'center', height: "30vh", margin: 5, width: "40%" }}>
      <Stack direction="row" sx={{ height: "100%", width: "100%", justifyContent: "center" }}>
        <Stack direction="column" sx={{ height: "100%", width: "100%", display: 'flex', justifyContent: "space-between" }}>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomDropdownInput value={"12"} onChange={() => { }} options={["one", "two"]} style={{ width: "100%" }} />
          </Stack>
          <Stack direction="row" sx={{ width: "100%", justifyContent: "center" }}>
            <IconButton color="primary">
              <SwapVertIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ display: 'flex', width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
            <CustomDropdownInput value={"12"} onChange={() => { }} options={["one", "two"]} style={{ width: "100%" }} />
          </Stack>
          <Stack sx={{}}>
            <Button variant="contained" color="primary" >
              Swap
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default SwapComponent