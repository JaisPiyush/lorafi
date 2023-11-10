
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';

interface CustomWalletDetailComponentProps {
  style?: React.CSSProperties;
}

const CustomWalletDetailComponent: React.FC<CustomWalletDetailComponentProps> = ({ style }) => {

  return (
    <Paper
      elevation={3}
      component="form"
      sx={{ ...style, padding: 0 }}
    >
      <Stack direction="row">
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <CloseIcon />
        </IconButton>
        <Divider sx={{ height: 35, m: 0.5 }} orientation="vertical" />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Placeholder Text"
          inputProps={{ 'aria-label': 'Placeholder Text' }}
          disabled
          value={"123123"}
        />
      </Stack>

    </Paper>
  );
};

export default CustomWalletDetailComponent;