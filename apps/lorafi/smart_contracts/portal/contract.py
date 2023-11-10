from typing import Final, Literal

import beaker
import pyteal as pt

from .wormhole_vaa import ContractTransferVAA, Bytes32

from pyteal import (
    Seq,
    Expr,
    TxnField,
    TxnType,
    abi,
    TealType,
)


publish_selector: Final[pt.Bytes] = pt.Bytes("publishMessage")


class PortalContractState:
    asset_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    reserve_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    core_app_id = beaker.GlobalStateValue(stack_type=TealType.uint64, static=True)
    storage_account = beaker.GlobalStateValue(stack_type=TealType.bytes, static=True)


app = beaker.Application(
    "portal",
    state=PortalContractState(),
)


@pt.Subroutine(TealType.none)
def _mint(amount: Expr, to: Expr):
    return pt.InnerTxnBuilder.Execute(
        {
            TxnField.type_enum: TxnType.ApplicationCall,
            TxnField.application_id: app.state.reserve_id.get(),
            TxnField.on_completion: pt.OnComplete.NoOp,
            TxnField.application_args: [
                pt.Bytes("mint_portable_token"),
                amount,
                to,
            ],
        }
    )


@pt.Subroutine(TealType.none)
def _transfer(asset_id: Expr, amount: Expr, sender: Expr, receiver: Expr) -> Expr:
    return pt.InnerTxnBuilder.Execute(
        {
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: asset_id,
            TxnField.asset_amount: amount,
            TxnField.sender: sender,
            TxnField.receiver: receiver,
            TxnField.assets: [asset_id],
        }
    )


@app.external(authorize=beaker.Authorize.only_creator())
def configure(
    app_id: abi.Uint64,
    storage_acc: abi.Address,
    asset_id: abi.Uint64,
    reserve_id: abi.Uint64,
):
    return Seq(
        app.state.core_app_id.set(app_id.get()),
        app.state.storage_account.set(storage_acc.get()),
        app.state.asset_id.set(asset_id.get()),
        app.state.reserve_id.set(reserve_id.get()),
    )


@pt.Subroutine(TealType.none)
def port_token(
    amount: abi.Uint64,
    token_address: abi.Byte,
    to: abi.Byte,
    fee: abi.Uint64,
):
    return Seq(
        (payload := pt.ScratchVar()).store(
            pt.Concat(
                pt.Bytes("base16", "03"),
                amount.encode(),
                token_address.encode(),
                pt.Bytes("base16", "0008"),
                to.encode(),
                pt.Bytes("base16", "0005"),
                fee.encode(),
            )
        ),
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.ApplicationCall,
                TxnField.application_id: app.state.core_app_id.get(),
                TxnField.application_args: [
                    publish_selector,
                    payload.load(),
                    pt.Itob(pt.Int(0)),
                ],
                TxnField.accounts: [app.state.storage_account.get()],
            }
        ),
    )


@app.external
def portal_transfer(vaa: abi.DynamicBytes, *, output: abi.DynamicBytes):
    return Seq(
        (ctvaa := ContractTransferVAA()).decode(vaa.get()),
        # Mint token
        _mint(
            ctvaa.amount.get(),
            ctvaa.from_address.get(),
        ),
    )
