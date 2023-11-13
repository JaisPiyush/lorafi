/* eslint-disable @typescript-eslint/no-unused-vars */
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import { CustomSelect } from './CustomSelectComponent';
import { ReactNode } from 'react';
interface CustomInputProps {
    value?: string;
    onChange: (value: string) => void;
    options: {value: string, label: string, image: ReactNode}[];
    amount?: string,
    onInput?: (amount: string) => void;
    disabled?: boolean
}

interface CustomInputProps {
    style?: React.CSSProperties;
}

const CustomDropdownInput: React.FC<CustomInputProps> = ({ value, 
    onChange, options, style, 
    amount = '0', onInput = (_) => {}, disabled  },
    
    ) => {
    return (
        <Paper
            component="form"
            sx={{ ...style }}
        >
            <FormControl fullWidth>
                <Stack direction="row">
                    <CustomSelect
                        onChange={onChange}
                        value={value}
                        options={options}
                    />
                    <InputBase
                        sx={{pl:1, flex: 1, borderRight: 1, borderTop: 1 }}
                        placeholder="0"
                        inputProps={{ 'aria-label': 'Placeholder Text' }}
                        value={amount}
                        onChange={(e) => {onInput(e.target.value)}}
                        disabled={disabled}
                    />
                </Stack>
            </FormControl>
        </Paper>
    );
};

export default CustomDropdownInput;