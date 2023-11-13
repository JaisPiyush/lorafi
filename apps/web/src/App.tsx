
import './App.css'
import {AppBarComponent, AppLandingCompoent, PortalComponet, MintComponet, SwapComponent} from './components'

import { Stack } from '@mui/material';
import { useAppSelector } from './hooks/store';

function App() {

  const [tab] = useAppSelector(state => [state.global.tab])


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
    </>
  )
}

export default App
