/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

import { SelectChangeEvent } from '@mui/material/Select';
import { tokensRecord } from '../constant';


interface CustomSelectProps {
  options: { value: string; label: string; image: React.ReactNode }[];
  onChange?: (value: string) => void;
  value?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({options, onChange = (_) => {}, value = '' }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value || '');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value)
  };

  return (
    <Box>
      <FormControl fullWidth>
        {/* <InputLabel>{label}</InputLabel> */}
        <Select value={selectedValue} onChange={handleChange} sx={{ width: 200 }}>
          {options.map((option, index) => (
            <MenuItem divider key={index} value={option.value as any}>
              {option.image}
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const CustomSelectComponent = ({onChange, value}: {onChange?: (value: string) => void, value?: string}) => {
  // const imageComponent = <ImageIcon fontSize="small" />;

  const options = Object.values(tokensRecord).map((token) => {
    return {
      value: token.assetId.toString(),
      label: token.symbol,
      image: <img src={token.url} height={'20px'} />
    }
  })

  return <CustomSelect  options={options} onChange={onChange} value={value} />;
};

export default CustomSelectComponent;
