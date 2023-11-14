import * as algokit from '@algorandfoundation/algokit-utils'
import { getAlgodClient, mapStateValue } from "../utils";
import { pool } from 'lorafi';
import algosdk, { TransactionSigner } from 'algosdk';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { pools } from '../constant';


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



export const getLPTokenAssetId = async (address: string, algoConnect: MyAlgoConnect) => {
    const algodClient = getAlgodClient()

    const method = new algosdk.ABIMethod({
        name: 'get_lp_token_asset',
        args: [],
        returns: {
            type: 'uint64'
        }
    })
    const txn = algosdk.makeApplicationNoOpTxnFromObject({
        from: address,
        suggestedParams: await algodClient.getTransactionParams().do(),
        appIndex: pools[0],
        appArgs: [
            method.getSelector()
        ],
    });
    const signedTxn = await algoConnect.signTransaction(txn.toByte());
    const tx = await algodClient.sendRawTransaction(signedTxn.blob).do();
    console.log(tx)
    const res = await algosdk.waitForConfirmation(algodClient, tx.txId, 4 );
    console.log(res)

}

