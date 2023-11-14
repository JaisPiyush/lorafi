import algosdk, { TransactionSigner } from "algosdk";
import Base64 from 'crypto-js/enc-base64';
import * as CryptoJS from 'crypto-js'
import MyAlgoConnect from "@randlabs/myalgo-connect";


export function getAlgodClient() {
    return new algosdk.Algodv2('',
        'https://testnet-api.algonode.cloud')
}

enum DataTypeIndex {
    Uint = 2,
    Bytes = 1
}

interface StatePackedValue {
    bytes: string;
    type: 2;
    uint: number
}

export function mapStateValue(
    state: Array<{key: string, value: StatePackedValue}>)
    : Record<string, number | string> {

        const data: Record<string, number | string> = {}
        for (const arg of state) {
            const name = Base64.parse(arg.key).toString(CryptoJS.enc.Utf8);
            data[name] = arg.value.type === DataTypeIndex.Uint? arg.value.uint
                : Base64.parse(arg.value.bytes).toString(CryptoJS.enc.Utf8)
               
        }

        return data

}


export const getSigner = (myAlgoConnect: MyAlgoConnect): TransactionSigner => {
    return async (txnGroup, indexesToSign) => {
        const signed: Uint8Array[] = [];
        for (const index of indexesToSign) {
            signed.push((await myAlgoConnect.signTransaction(txnGroup[index].toByte())).blob)
        }
        return signed
    }
}