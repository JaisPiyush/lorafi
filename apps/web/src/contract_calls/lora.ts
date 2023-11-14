import MyAlgoConnect from "@randlabs/myalgo-connect";
import { Tokens, algorandAppId, tokensRecord } from "../constant";
import { getAlgodClient, getSigner, mapStateValue } from "../utils"
import algosdk from "algosdk";

export const getMintRate = async () : Promise<number> => {
    const algodClient = getAlgodClient();
    const acc = await algodClient.getApplicationByID(algorandAppId['Lora']).do();
    const state = mapStateValue(acc.params['global-state']);
    return state['rate'] as number
}


export const mintYieldTokens = async (
    address: string,
    myAlgoConnect: MyAlgoConnect,
    amount: number
) => {
    const algodClient = getAlgodClient();
    const signer = getSigner(myAlgoConnect)
    const atc = new algosdk.AtomicTransactionComposer();
    const params = await algodClient.getTransactionParams().do()
    atc.addTransaction({
        txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: address,
            assetIndex: tokensRecord[Tokens.aDai].assetId,
            suggestedParams: params,
            to: address,
            amount: amount, 
        }),
        signer
    });
    atc.addMethodCall({
        appID: algorandAppId['Lora'],
        method: new algosdk.ABIMethod({
            name: 'mint',
            args: [
                {type: 'account'}
            ],
            returns: {type: 'void'}
        }),
        methodArgs: [
            algosdk.decodeAddress(address).publicKey
        ],
        sender: address,
        signer,
        suggestedParams: params,
        appForeignAssets: [
            tokensRecord[Tokens.aDai].assetId,
            tokensRecord[Tokens.PT_aDai].assetId,
            tokensRecord[Tokens.YT_aDai].assetId
        ],
        appAccounts: [
            address,
            address
        ]
    });

    await atc.execute(algodClient, 4);

}