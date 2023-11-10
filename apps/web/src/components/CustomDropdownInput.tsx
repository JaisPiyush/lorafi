import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import CustomSelectCompoent from './CustomSelectComponent';
interface CustomInputProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

interface CustomInputProps {
    style?: React.CSSProperties;
}

const CustomDropdownInput: React.FC<CustomInputProps> = ({ value, onChange, options, style }) => {
    return (
        <Paper
            component="form"
            sx={{ ...style }}
        >
            <FormControl fullWidth>
                <Stack direction="row">
                    <CustomSelectCompoent/>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Placeholder Text"
                        inputProps={{ 'aria-label': 'Placeholder Text' }}
                    />
                </Stack>
            </FormControl>
        </Paper>
    );
};

export default CustomDropdownInput;