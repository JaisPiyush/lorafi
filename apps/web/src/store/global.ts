import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface GlobalState {
    tab: 'swap' | 'portal' | 'mint'
}

const initialState: GlobalState = {
    tab: 'portal'
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setTab: (state, action: PayloadAction<GlobalState['tab']>) => {
            state.tab = action.payload;
        }
    }
})
 

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
