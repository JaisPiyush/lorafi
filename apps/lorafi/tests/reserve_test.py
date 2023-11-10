import pytest
from algokit_utils import (
    ApplicationClient,
    ApplicationSpecification,
    get_localnet_default_account,
    Account,
    ensure_funded,
    EnsureBalanceParameters,
    transfer_asset,
    TransferAssetParameters,
)
from algosdk.v2client.algod import AlgodClient

from smart_contracts.reserve import contract as reserve_contract

# from algosdk.mnemonic import to_private_key
# from algosdk.account import address_from_private_key
# from algosdk.atomic_transaction_composer import AccountTransactionSigner


# Generated account with algos on Testnet
# ACCOUNT_MNEMONIC = "tenant helmet motor sauce appear buddy gloom park average glory course wire buyer ostrich history time refuse room blame oxygen film diamond confirm ability spirit"

# ACCOUNT_SECRET = to_private_key(ACCOUNT_MNEMONIC)
# ACCOUNT_SIGNER = AccountTransactionSigner(ACCOUNT_SECRET)
# ACCOUNT_ADDRESS = address_from_private_key(ACCOUNT_SECRET)


@pytest.fixture(scope="session")
def reserve_app_spec(algod_client: AlgodClient) -> ApplicationSpecification:
    return reserve_contract.app.build(algod_client)


@pytest.fixture(scope="session")
def signer(algod_client: AlgodClient) -> Account:
    return get_localnet_default_account(algod_client)


@pytest.fixture(scope="session")
def reserve_client(
    algod_client: AlgodClient,
    reserve_app_spec: ApplicationSpecification,
    signer: Account,
) -> ApplicationClient:
    client = ApplicationClient(
        algod_client,
        app_spec=reserve_app_spec,
        signer=signer,
    )
    client.create()
    ensure_funded(
        algod_client,
        EnsureBalanceParameters(
            account_to_fund=signer,
            min_spending_balance_micro_algos=50000,
            min_funding_increment_micro_algos=1000_000 * 100,
        ),
    )

    ensure_funded(
        algod_client,
        EnsureBalanceParameters(
            account_to_fund=client.app_address,
            min_spending_balance_micro_algos=50000,
            min_funding_increment_micro_algos=1000_000 * 100,
        ),
    )

    return client


# def test_says_hello(reserve_client: ApplicationClient) -> None:
#     result = reserve_client.call(lora_contract.hello, name="World")

#     assert result.return_value == "Hello, World"


def test_create_asa(reserve_client: ApplicationClient, signer: Account) -> None:
    result = reserve_client.call(
        reserve_contract.create_asa,
        name="DTT",
        unit_name="DTT",
        url="DTT",
    )

    assert result.return_value > 0

    res = reserve_client.call(
        reserve_contract.set_portal_asset_data,
        asset=result.return_value,
        commander=signer.address,
        transaction_parameters={
            "accounts": [signer.address],
            "foreign_assets": [result.return_value],
        },
    )


def test_mint_portable_token(
    reserve_client: ApplicationClient, signer: Account
) -> None:
    state = reserve_client.get_global_state()
    transfer_asset(
        reserve_client.algod_client,
        TransferAssetParameters(
            asset_id=state["portable_asset_id"],
            amount=0,
            from_account=signer,
            to_address=signer.address,
        ),
    )
    result = reserve_client.call(
        reserve_contract.mint_portable_token,
        amount=10,
        to=signer.address,
        transaction_parameters={
            "accounts": [signer.address],
            "foreign_assets": [state["portable_asset_id"]],
        },
    )
    asset = reserve_client.algod_client.account_asset_info(
        signer.address, state["portable_asset_id"]
    )
    assert (
        asset["asset-holding"]["asset-id"] == state["portable_asset_id"]
        and asset["asset-holding"]["amount"] == 10
    )
