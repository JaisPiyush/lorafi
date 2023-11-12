import algosdk from "algosdk"
import { Tokens, algorandAppId } from "../constant"


const algodClient = new algosdk.Algodv2(
    process.env.ALGOD_TOKEN as string,
    process.env.ALGOD_HOST as string
)



