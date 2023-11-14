/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
  disabled?: boolean;
  onInput?: (t: string) => void
  placeholder?: string
}

const CustomWalletDetailComponent: React.FC<CustomWalletDetailComponentProps> = ({ 
  style, address, onClose, 
  placeholder="Placeholder Text",
  disabled = true, onInput = (_) => {} }) => {

  return (
    <Paper
      elevation={0}
      component="form"
      sx={{ ...style, padding: 0, border:1, }}
    >
      <Stack direction="row">
        
        
        <InputBase
          sx={{ ml: 1, flex: 1}}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'Placeholder Text' }}
          disabled={disabled}
          value={address}
          onInput={(e) => {onInput((e.target as any).value)}}
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