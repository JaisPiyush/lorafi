import algosdk from "algosdk"


export const useAlgodClient = () => {
    const algodClient = new algosdk.Algodv2(
        import.meta.env.ALGOD_TOKEN as string,
        import.meta.env.ALGOD_HOST as string
    )

    return algodClient
}