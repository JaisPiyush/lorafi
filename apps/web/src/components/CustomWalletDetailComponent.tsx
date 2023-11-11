
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';

interface CustomWalletDetailComponentProps {
  style?: React.CSSProperties;
  address: string;
  onClose: () => void;
}

const CustomWalletDetailComponent: React.FC<CustomWalletDetailComponentProps> = ({ style, address, onClose }) => {

  return (
    <Paper
      elevation={3}
      component="form"
      sx={{ ...style, padding: 0 }}
    >
      <Stack direction="row">
        
        
        <InputBase
          sx={{ ml: 1, flex: 1}}
          placeholder="Placeholder Text"
          inputProps={{ 'aria-label': 'Placeholder Text' }}
          disabled
          value={address}
        />
        <Divider sx={{ height: 35, m: 0.5 }} orientation="vertical" />
        <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={() => {onClose()}}>
          <CloseIcon />
        </IconButton>
      </Stack>

    </Paper>
  );
};

export default CustomWalletDetailComponent;