import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import { SelectChangeEvent } from '@mui/material/Select';

interface CustomSelectProps {
  label: string;
  options: { value: string; label: string; image: React.ReactNode }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth>
        {/* <InputLabel>{label}</InputLabel> */}
        <Select value={selectedValue} onChange={handleChange} sx={{ width: 200 }}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.image}
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const CustomSelectCompoent = () => {
  const imageComponent = <ImageIcon fontSize="small" />;

  const options = [
    { value: 'option1', label: 'Option 1', image: imageComponent },
    { value: 'option2', label: 'Option 2', image: imageComponent },
    // Add more options as needed
  ];

  return <CustomSelect label="Select an option" options={options} />;
};

export default CustomSelectCompoent;
