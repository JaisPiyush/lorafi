import algosdk from "algosdk";
import Base64 from 'crypto-js/enc-base64';
import * as CryptoJS from 'crypto-js'


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