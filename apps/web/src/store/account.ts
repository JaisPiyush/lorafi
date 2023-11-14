import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface AccountState {
    address?: string;
    isConnected: boolean
}

const initialState: AccountState = {
    isConnected: false,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAddress: (state, payload: PayloadAction<string | undefined>) => {
            state.address = payload.payload;
            state.isConnected = payload.payload !== undefined && payload.payload.length > 0;
        }
    }
})
 

export const accountActions = accountSlice.actions;

export default accountSlice.reducer;
