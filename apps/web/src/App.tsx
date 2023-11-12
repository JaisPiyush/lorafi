
import './App.css'
import {AppBarComponent, AppLandingCompoent, PortalComponet, MintComponet, SwapComponent} from './components'
import { useState } from 'react'
import { Stack } from '@mui/material';

function App() {

  const [componentState, setComponentState] = useState<string>("mint");

  const renderSwitch = (state: String) => {
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
        {renderSwitch(componentState)}
      </Stack>
    </>
  )
}

export default App
