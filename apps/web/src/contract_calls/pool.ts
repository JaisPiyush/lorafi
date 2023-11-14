
import { getAlgodClient, mapStateValue } from "../utils";
import algosdk, { TransactionSigner } from 'algosdk';
import MyAlgoConnect from '@randlabs/myalgo-connect';



export interface PoolState {
    appId: number;
    name: string;
    asset1: number;
    asset2: number;
    lpAsset: number;
    k?: number; 
    asset1Reserve?: number;
    asset2Reserve?: number;
    totalSupply?: number;

}


export async function getGlobalStateOfPool(poolId: number): Promise<PoolState> {
    const algodClient = getAlgodClient()
    const accountInfo = await algodClient.getApplicationByID(poolId).do();
    const state = mapStateValue(accountInfo.params['global-state']);
    return {
        appId: poolId,
        name: state['name'] as string,
        asset1: state['asset_1_id'] as number,
        asset2: state['asset_2_id'] as number,
        lpAsset: state['lp_asset_id'] as number,
        k: state['k_constant'] as number,
        asset1Reserve: state['asset_1_reserve'] as number,
        asset2Reserve: state['asset_2_reserve'] as number,
        totalSupply: state['total_supply'] as number
    }

}



