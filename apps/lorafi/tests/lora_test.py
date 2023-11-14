import pytest
from algokit_utils import (
    ApplicationClient,
    ApplicationSpecification,
    TransferAssetParameters,
    get_localnet_default_account,
    Account,
    ensure_funded,
    EnsureBalanceParameters,
    transfer_asset,
)
from algosdk.v2client.algod import AlgodClient
from algosdk.transaction import ApplicationCallTxn, AssetTransferTxn
from algosdk.atomic_transaction_composer import (
    AtomicTransactionComposer,
    TransactionWithSigner,
)


from smart_contracts.lora import contract as lora_contract
from smart_contracts.reserve import contract as reserve_contract


@pytest.fixture(scope="session")
def lora_app_spec(algod_client: AlgodClient) -> ApplicationSpecification:
    return lora_contract.app.build(algod_client)


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
    client = ApplicationClient(algod_client, app_spec=reserve_app_spec, signer=signer)

    client.create()
    # Fund the signer account
    ensure_funded(
        algod_client,
        EnsureBalanceParameters(
            account_to_fund=signer,
            min_spending_balance_micro_algos=50000,
            min_funding_increment_micro_algos=1000_000 * 100,
        ),
    )
    # Fund the app
    ensure_funded(
        algod_client,
        EnsureBalanceParameters(
            account_to_fund=client.app_address,
            min_spending_balance_micro_algos=50000,
            min_funding_increment_micro_algos=1000_000 * 100,
        ),
    )

    # Create the portable asset
    result = client.call(
        reserve_contract.create_asa,
        name="DTT",
        unit_name="DTT",
        url="DTT",
    )
    # set portal
    client.call(
        reserve_contract.set_portal_asset_data,
        asset=result.return_value,
        commander=signer.address,
        transaction_parameters={
            "accounts": [signer.address],
            "foreign_assets": [result.return_value],
        },
    )
    # Create PT
    pt_result = client.call(
        reserve_contract.create_asa,
        name="PT",
        unit_name="PT",
        url="PT",
    )
    # Create YT
    yt_result = client.call(
        reserve_contract.create_asa,
        name="YT",
        unit_name="YT",
        url="YT",
    )
    # Call set market token
    client.call(
        reserve_contract.set_market_token,
        principal_token=pt_result.return_value,
        yield_token=yt_result.return_value,
        commander=signer.address,
        transaction_parameters={
            "accounts": [signer.address],
            "foreign_assets": [pt_result.return_value, yt_result.return_value],
        },
    )
    # Opt-in singer to PT and YT, DTT
    transfer_asset(
        algod_client,
        TransferAssetParameters(
            asset_id=result.return_value,
            amount=0,
            from_account=signer,
            to_address=signer.address,
        ),
    )
    transfer_asset(
        algod_client,
        TransferAssetParameters(
            asset_id=pt_result.return_value,
            amount=0,
            from_account=signer,
            to_address=signer.address,
        ),
    )
    transfer_asset(
        algod_client,
        TransferAssetParameters(
            asset_id=yt_result.return_value,
            amount=0,
            from_account=signer,
            to_address=signer.address,
        ),
    )
    # Mint some token to signer
    client.call(
        reserve_contract.mint_portable_token,
        amount=1000,
        to=signer.address,
        transaction_parameters={
            "foreign_assets": [result.return_value],
            "accounts": [signer.address],
        },
    )
    return client


@pytest.fixture(scope="session")
def lora_client(
    algod_client: AlgodClient,
    lora_app_spec: ApplicationSpecification,
    signer: Account,
    reserve_client: ApplicationClient,
) -> ApplicationClient:
    client = ApplicationClient(
        algod_client,
        app_spec=lora_app_spec,
        signer=signer,
    )
    client.create()
    ensure_funded(
        algod_client,
        EnsureBalanceParameters(
            account_to_fund=client.app_address,
            min_spending_balance_micro_algos=50000,
            min_funding_increment_micro_algos=1000_000 * 100,
        ),
    )

    reserve_state = reserve_client.get_global_state()
    reserve_client.call(
        reserve_contract.set_portal_asset_data,
        asset=reserve_state["portable_asset_id"],
        commander=client.app_address,
        transaction_parameters={
            "accounts": [client.app_address],
            "foreign_assets": [reserve_state["portable_asset_id"]],
        },
    )
    reserve_client.call(
        reserve_contract.set_market_token,
        principal_token=reserve_state["principal_token_id"],
        yield_token=reserve_state["yield_token_id"],
        commander=client.app_address,
        transaction_parameters={
            "accounts": [client.app_address],
            "foreign_assets": [
                reserve_state["principal_token_id"],
                reserve_state["yield_token_id"],
            ],
        },
    )

    client.call(
        lora_contract.configure,
        reserve=reserve_client.app_id,
        asset=reserve_state["portable_asset_id"],
        rate_oracle=signer.address,
        _pt=reserve_state["principal_token_id"],
        _yt=reserve_state["yield_token_id"],
        transaction_parameters={
            "accounts": [signer.address],
            "foreign_assets": [
                reserve_state["portable_asset_id"],
                reserve_state["principal_token_id"],
                reserve_state["yield_token_id"],
            ],
        },
    )

    client.call(lora_contract.update_rate, rate=4500)

    return client


def test_mint(lora_client: ApplicationClient, signer: Account) -> None:
    state = lora_client.get_global_state()
    txn1 = AssetTransferTxn(
        sender=signer.address,
        sp=lora_client.algod_client.suggested_params(),
        receiver=lora_client.app_address,
        amt=10,
        index=state["asset_id"],
    )

    atc = AtomicTransactionComposer()
    atc.add_transaction(TransactionWithSigner(txn=txn1, signer=signer.signer))
    lora_client.compose_call(
        atc,
        lora_contract.mint,
        to=signer.address,
        transaction_parameters={
            "accounts": [signer.address],
            "foreign_apps": [state["reserve_id"]],
            "foreign_assets": [state["asset_id"], state["pt_id"], state["yt_id"]],
        },
    )
    res = lora_client.execute_atc(atc)
    dtt_holdings = lora_client.algod_client.account_asset_info(
        signer.address, state["asset_id"]
    )

    assert dtt_holdings["asset-holding"]["amount"] == 990
