/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
interface CustomInputProps {
    avatarSrc: string;
    label: string;
    placeholder?: string;
    onInput?: (inp: string) => void
    value?: string;
    disabled?: boolean;
    type?: string
}

const CustomInputComponent: React.FC<CustomInputProps> = ({
    type, 
    avatarSrc= '/path-to-avatar.jpg', 
    label="Your Label", 
    placeholder="Your Placeholder", 
    value = '0',
    disabled = false,
    onInput = (_) => {} }) => {
    return (
        <Paper elevation={0} component="form" 
            sx={{ width: "100%", padding: 1, border:1}}>
            <Stack direction="row">
                <Avatar src={avatarSrc} alt="Avatar" style={{ marginRight: '1px' }} />
                <Stack sx={{ width: 80, overflow: "hidden",justifyContent:"space-around" }}>
                    <Typography>{label}</Typography>
                </Stack>
                <Divider orientation="vertical" sx={{ height: 32, m: 0.5 }} />
                <InputBase 
                    disabled={disabled} 
                    value={value} 
                    placeholder={placeholder} 
                    type={type}
                    onInput={(e) => {onInput((e.target as any).value)}} 
                />
            </Stack>

        </Paper>
    );
};


export default CustomInputComponent;