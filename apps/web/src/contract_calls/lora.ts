import MyAlgoConnect from "@randlabs/myalgo-connect";
import { getAlgodClient, getSigner } from "../utils";
import algosdk from "algosdk";
import { Tokens, algorandAppId, tokensRecord, appAddress } from "../constant";

export const mintYieldTokens = async (address: string, myAlgoConnect: MyAlgoConnect, amount: number) => {
    const algodClient = getAlgodClient();
    const signer = getSigner(myAlgoConnect);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: appAddress['Lora'],
        assetIndex: algorandAppId['aDAI'],
        amount: amount,
        suggestedParams: suggestedParams,
    })
    atc.addTransaction({
        txn,
        signer
    })
    atc.addMethodCall({
        appID: algorandAppId['Reserve'],
        method: new algosdk.ABIMethod({
            name: 'mint_yield_token_pair',
            args: [
                {type: 'uint64'},
                {type: 'uint64'},
                {type: 'account'},
                {type: 'asset'},
                {type: 'asset'}
            ],
            returns: {type: 'void'}
        }),
        sender: address,
        methodArgs: [
            parseInt((amount * (1 - 0.0025)).toString()), 
            parseInt((amount * 0.0025).toString()), 
            address,
            algorandAppId['PT_aDAI'],
            algorandAppId['YT_aDAI']
        ],
        suggestedParams: suggestedParams,
        appAccounts: [address],
        appForeignAssets: [
            tokensRecord[Tokens.aDai].assetId,
            algorandAppId['PT_aDAI'],
            algorandAppId['YT_aDAI']
        ],
        signer: signer
    })

    const res = await atc.execute(algodClient, 4);
    console.log(res)
}

export const burnYieldTokens = async (address: string, myAlgoConnect: MyAlgoConnect, amount: number) => {
    const algodClient = getAlgodClient();
    const signer = getSigner(myAlgoConnect);
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = new algosdk.AtomicTransactionComposer();
    const yt = parseInt(((amount * 0.0025)/ (1-0.0025)).toString())
    const txn1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: appAddress['Lora'],
        assetIndex: algorandAppId['PT_aDAI'],
        amount: amount,
        suggestedParams: suggestedParams,
    })
    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: appAddress['Lora'],
        assetIndex: algorandAppId['YT_aDAI'],
        amount: yt,
        suggestedParams: suggestedParams,
    })
    atc.addTransaction({
        txn: txn1,
        signer
    })
    atc.addTransaction({
        txn: txn2,
        signer
    })
    const aDai = yt + amount
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
            aDai, 
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