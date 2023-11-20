import algosdk from "algosdk"
// import * as algokit from '@algorandfoundation/algokit-utils'
import { getAlgodClient, getSigner } from "../utils";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { Tokens, algorandAppId, tokensRecord } from "../constant";
// import {reserve} from 'lorafi'






export const mintADaiTokens = async (
    address: string,
    myAlgoConnect: MyAlgoConnect,
    amount: number
) => {
    const algodClient = getAlgodClient();
    const signer = getSigner(myAlgoConnect);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();
    atc.addMethodCall({
        appID: algorandAppId['Reserve'],
        method: new algosdk.ABIMethod({
            name: 'mint_portable_token',
            args: [
                {type: 'uint64'},
                {type: 'account'},
                {type: 'asset'}
            ],
            returns: {type: 'void'}
        }),
        sender: address,
        methodArgs: [
            amount, 
            address,
            algorandAppId['aDAI']
        ],
        suggestedParams: suggestedParams,
        appAccounts: [address],
        appForeignAssets: [tokensRecord[Tokens.aDai].assetId],
        signer: signer
    })
    
    const res = await atc.execute(algodClient, 4);
    console.log(res)

}

