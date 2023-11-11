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

from smart_contracts.pool import contract as pool_contract
from smart_contracts.reserve import contract as reserve_contract


@pytest.fixture(scope="session")
def pool_app_spec(algod_client: AlgodClient) -> ApplicationSpecification:
    return pool_contract.app.build(algod_client)


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
    client.call(
        reserve_contract.mint_yield_token_pair,
        principal_amount=1000,
        yield_amount=1000,
        to=signer.address,
        transaction_parameters={
            "foreign_assets": [yt_result.return_value, pt_result.return_value],
            "accounts": [signer.address],
        },
    )
    return client


@pytest.fixture(scope="session")
def pool_client(
    algod_client: AlgodClient,
    pool_app_spec: ApplicationSpecification,
    signer: Account,
) -> ApplicationClient:
    client = ApplicationClient(algod_client, app_spec=pool_app_spec, signer=signer)
    client.create()
    # Fund the app
    ensure_funded(
        algod_client,
        EnsureBalanceParameters(
            account_to_fund=client.app_address,
            min_spending_balance_micro_algos=50000,
            min_funding_increment_micro_algos=1000_000 * 100,
        ),
    )
    return client


# @pytest.fixture(scope="session")
def pool_configured_client(
    pool_client: ApplicationClient, reserve_client: ApplicationClient, signer: Account
) -> ApplicationClient:
    reserve_state = reserve_client.get_global_state()
    pool_client.call(
        pool_contract.configure,
        name="test_pool",
        asset_1=reserve_state["portable_asset_id"],
        asset_2=reserve_state["yield_token_id"],
        transaction_parameters={
            "foreign_assets": [
                reserve_state["portable_asset_id"],
                reserve_state["yield_token_id"],
            ]
        },
    )
    state = pool_client.get_global_state()
    # opt-in liquidity
    transfer_asset(
        pool_client.algod_client,
        TransferAssetParameters(
            asset_id=state["lp_asset_id"],
            amount=0,
            from_account=signer,
            to_address=signer.address,
        ),
    )


def test_configure(
    pool_client: ApplicationClient, reserve_client: ApplicationClient, signer: Account
) -> None:
    reserve_state = reserve_client.get_global_state()
    pool_client.call(
        pool_contract.configure,
        name="test_pool",
        asset_1=reserve_state["portable_asset_id"],
        asset_2=reserve_state["yield_token_id"],
        transaction_parameters={
            "foreign_assets": [
                reserve_state["portable_asset_id"],
                reserve_state["yield_token_id"],
            ]
        },
    )
    state = pool_client.get_global_state()
    assert state["asset_1_id"] == reserve_state["portable_asset_id"]
    assert state["asset_2_id"] == reserve_state["yield_token_id"]
    # opt-in liquidity
    transfer_asset(
        pool_client.algod_client,
        TransferAssetParameters(
            asset_id=state["lp_asset_id"],
            amount=0,
            from_account=signer,
            to_address=signer.address,
        ),
    )


def test_deposit(
    pool_client: ApplicationClient, reserve_client: ApplicationClient, signer: Account
) -> None:
    state = pool_client.get_global_state()

    if len(state) == 0:
        pool_configured_client(pool_client, reserve_client, signer)
    print(state)
    atc = AtomicTransactionComposer()
    txn1 = AssetTransferTxn(
        sender=signer.address,
        sp=pool_client.algod_client.suggested_params(),
        receiver=pool_client.app_address,
        amt=10,
        index=state["asset_1_id"],
    )
    atc.add_transaction(TransactionWithSigner(txn=txn1, signer=signer.signer))
    txn2 = AssetTransferTxn(
        sender=signer.address,
        sp=pool_client.algod_client.suggested_params(),
        receiver=pool_client.app_address,
        amt=80,
        index=state["asset_2_id"],
    )
    atc.add_transaction(TransactionWithSigner(txn=txn2, signer=signer.signer))
    pool_client.compose_call(
        atc,
        pool_contract.deposit,
        to=signer.address,
        transaction_parameters={
            "foreign_assets": [
                state["asset_1_id"],
                state["asset_2_id"],
                state["lp_asset_id"],
            ],
        },
    )
    pool_client.execute_atc(atc)
    state = pool_client.get_global_state()
    print(state)
    assert state["asset_1_reserve"] == 10
    assert state["asset_2_reserve"] == 80
    assert state["k_constant"] == 80 * 10
    assert state["total_supply"] == 28


def test_swap(pool_client: ApplicationClient, signer: Account) -> None:
    state = pool_client.get_global_state()
    print(state)
    atc = AtomicTransactionComposer()
    txn1 = AssetTransferTxn(
        sender=signer.address,
        sp=pool_client.algod_client.suggested_params(),
        receiver=pool_client.app_address,
        amt=2,
        index=state["asset_1_id"],
    )
    atc.add_transaction(TransactionWithSigner(txn=txn1, signer=signer.signer))
    pool_client.compose_call(
        atc,
        pool_contract.swap,
        to=signer.address,
        transaction_parameters={
            "foreign_assets": [
                state["asset_1_id"],
                state["asset_2_id"],
                state["lp_asset_id"],
            ],
        },
    )

    pool_client.execute_atc(atc)
    state = pool_client.get_global_state()
    assert state["asset_2_reserve"] == 80 - 14
