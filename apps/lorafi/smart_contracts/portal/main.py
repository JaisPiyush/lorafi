import base64
from algosdk import transaction
from algosdk.encoding import decode_address
from algosdk.atomic_transaction_composer import (
    AccountTransactionSigner,
    AtomicTransactionComposer,
    TransactionWithSigner,
    LogicSigTransactionSigner,
)
from algosdk.mnemonic import to_private_key
from algosdk.account import address_from_private_key
from algosdk.v2client import algod
from algosdk.logic import get_application_address

from beaker import *


# from parse_vaa import parseVAA
from tmpl_sig import TmplSig

# RPC connection parameters
ALGOD_HOST = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

# Testnet app id for core bridge
WORMHOLE_CORE_ID = 86525623
WORMHOLE_CORE_ADDR = get_application_address(WORMHOLE_CORE_ID)

# Generated account with algos on Testnet
ACCOUNT_MNEMONIC = "tenant helmet motor sauce appear buddy gloom park average glory course wire buyer ostrich history time refuse room blame oxygen film diamond confirm ability spirit"

ACCOUNT_SECRET = to_private_key(ACCOUNT_MNEMONIC)
ACCOUNT_SIGNER = AccountTransactionSigner(ACCOUNT_SECRET)
ACCOUNT_ADDRESS = address_from_private_key(ACCOUNT_SECRET)

# our PingPong app id
APP_ID = 475171467


def get_storage_account(emitter_addr: str) -> transaction.LogicSigAccount:
    return TmplSig().populate(
        {
            "TMPL_ADDR_IDX": 0,
            "TMPL_EMITTER_ID": decode_address(emitter_addr).hex(),
            "TMPL_APP_ID": WORMHOLE_CORE_ID,
            "TMPL_APP_ADDRESS": decode_address(WORMHOLE_CORE_ADDR).hex(),
        }
    )


def initialize_storage(
    client: algod.AlgodClient,
    lsa: transaction.LogicSigAccount,
    funder: str,
    signer: AccountTransactionSigner,
):
    sp = client.suggested_params()
    sp.flat_fee = True
    sp.fee = 2000

    atc = AtomicTransactionComposer()
    atc.add_transaction(
        TransactionWithSigner(
            txn=transaction.PaymentTxn(funder, sp, lsa.address(), 1002000),
            signer=signer,
        )
    )

    sp.fee = 0
    atc.add_transaction(
        TransactionWithSigner(
            txn=transaction.ApplicationCallTxn(
                lsa.address(),
                sp,
                WORMHOLE_CORE_ID,
                transaction.OnComplete.OptInOC,
                rekey_to=WORMHOLE_CORE_ADDR,
            ),
            signer=LogicSigTransactionSigner(lsa),
        )
    )
    result = atc.execute(client, 4)
    print(f"Opted in at round: {result.confirmed_round}")


def demo(app_id: int = 0):
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_HOST)

    lsa = get_storage_account(get_application_address(app_id))

    initialize_storage(algod_client, lsa, ACCOUNT_ADDRESS, ACCOUNT_SIGNER)
    print("Initialized storage for core contract sequence tracking")
    print(f"Storage Account: {lsa.address()}")

    # TODO:
    # while True:
    #     # relay VAAs


if __name__ == "__main__":
    print(ACCOUNT_ADDRESS)
    demo(app_id=APP_ID)

# Storage Acct: LE55K5Q5F5X27ZLPTCLRAEEGZHQVBX3VSVUCW6VFL4W27XX7AKYKKKS4NE
# Account: 2RTLJ5YR6YNF4KBZ6SSYFSQLRGXDORU5JV7VRQ6P52MOHQVGL4NFT3IPBQ
