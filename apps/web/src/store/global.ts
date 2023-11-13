import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface GlobalState {
    tab: 'swap' | 'portal' | 'mint',
    alertMsg: string | null;
    alertType: 'error' | 'success' | 'info'
}

const initialState: GlobalState = {
    tab: 'swap',
    alertMsg: null,
    alertType: 'error'
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setTab: (state, action: PayloadAction<GlobalState['tab']>) => {
            state.tab = action.payload;
        },
        setAlert: (state, 
            action: PayloadAction<{msg: string | null, type?: GlobalState['alertType']}>) => {
                state.alertMsg = action.payload.msg;
                state.alertType = action.payload.type || state.alertType
            }
    }
})
 

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
