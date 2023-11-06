import pytest
from algokit_utils import (
    ApplicationClient,
    ApplicationSpecification,
    get_localnet_default_account,
)
from algosdk.v2client.algod import AlgodClient

from smart_contracts.lora import contract as lora_contract


@pytest.fixture(scope="session")
def lora_app_spec(algod_client: AlgodClient) -> ApplicationSpecification:
    return lora_contract.app.build(algod_client)


@pytest.fixture(scope="session")
def lora_client(
    algod_client: AlgodClient, lora_app_spec: ApplicationSpecification
) -> ApplicationClient:
    client = ApplicationClient(
        algod_client,
        app_spec=lora_app_spec,
        signer=get_localnet_default_account(algod_client),
    )
    client.create()
    return client


def test_says_hello(lora_client: ApplicationClient) -> None:
    result = lora_client.call(lora_contract.hello, name="World")

    assert result.return_value == "Hello, World"
