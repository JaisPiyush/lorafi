
import './App.css'
import {AppBarComponent, AppLandingCompoent, PortalComponet, MintComponet, SwapComponent} from './components'

import { Alert, Snackbar, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks/store';
import { globalActions } from './store/global';

function App() {

  const [tab, alertMsg, alertType] = useAppSelector(state => [state.global.tab, 
    state.global.alertMsg, state.global.alertType])
  
  const dispatch = useAppDispatch()

  const handleOnCloseAlert = () => {
    dispatch(globalActions.setAlert({msg: null}));
  }


  const renderSwitch = (state: 'swap' | 'portal' | 'mint') => {
    switch (state) {
      case "portal": return (
        <>
          <PortalComponet/>
        </>
      );
      case "mint": return (
        <>
          <MintComponet/>
        </>
      );
      case "swap": return (
        <>
          <SwapComponent/>
        </>
      );
      default: return (
        <>
          <AppLandingCompoent/>
        </>
      );
    }
  }

  return (
    <>
      <AppBarComponent/>
      <Stack direction="row" sx={{width:"100%", height: "100%", justifyContent: "center"}}>
        {renderSwitch(tab)}
      </Stack>
      <Snackbar open={alertMsg !== null} onClose={() => {
        handleOnCloseAlert()
      }} >
        <Alert severity={alertType} >{alertMsg}</Alert>
      </Snackbar>
    </>
  )
}

export default App
