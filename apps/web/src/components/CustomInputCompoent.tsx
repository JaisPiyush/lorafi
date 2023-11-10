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
    placeholder: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ avatarSrc, label, placeholder }) => {
    return (
        <Paper elevation={3} component="form"
            sx={{ width: "100%", padding: 1 }}>
            <Stack direction="row">
                <Avatar src={avatarSrc} alt="Avatar" style={{ marginRight: '1px' }} />
                <Stack sx={{ width: 120, overflow: "hidden",justifyContent:"space-around" }}>
                    <Typography>{label}</Typography>
                </Stack>
                <Divider orientation="vertical" sx={{ height: 32, m: 0.5 }} />
                <InputBase placeholder={placeholder} />
            </Stack>

        </Paper>
    );
};

const CustomInputCompoent = () => {
    const avatarSrc = '/path-to-avatar.jpg'; // Replace with the actual path to your avatar image

    return <CustomInput avatarSrc={avatarSrc} label="Your Label" placeholder="Your Placeholder" />;
};

export default CustomInputCompoent;