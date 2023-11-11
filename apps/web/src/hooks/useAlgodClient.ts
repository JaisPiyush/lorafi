import algosdk from "algosdk"


export const useAlgodClient = () => {
    const algodClient = new algosdk.Algodv2(
        process.env.ALGOD_TOKEN as string,
        process.env.ALGOD_HOST as string
    )

    return algodClient
}