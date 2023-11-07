from ast import Expr
from typing import Final, Literal

import beaker
import pyteal as pt
from beaker.lib.storage import BoxMapping

from .wormhole_vaa import ContractTransferVAA, Bytes32

from pyteal import (
    Subroutine,
    Seq,
    Assert,
    InnerTxnBuilder,
    TxnField,
    TxnType,
    abi,
    TealType,
)


publish_selector: Final[pt.Bytes] = pt.Bytes("publishMessage")


class PortalContractState:
    # Record of all portable assets
    portable_asset_record = BoxMapping(abi.Uint64, abi.Bool)


app = beaker.Application(
    "portal",
    state=PortalContractState(),
)
