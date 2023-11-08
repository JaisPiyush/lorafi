import beaker
import pyteal as pt
from pyteal import Seq, Assert, TealType, TxnField, TxnType, Expr, abi


DECIMAL = pt.Int(1000)


class LoraState:
    asset_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    rate_oracle = beaker.GlobalStateValue(stack_type=TealType.bytes)
    rate = beaker.GlobalStateValue(stack_type=TealType.uint64)
    reserve_id = beaker.GlobalStateValue(stack_type=TealType.uint64)


app = beaker.Application("lora", state=LoraState())


@pt.Subroutine(TealType.uint64)
def is_rate_oracle(acct: Expr):
    return acct == app.state.rate_oracle.get()


@app.external(authorize=is_rate_oracle)
def update_rate(rate: abi.Uint64):
    return Seq(app.state.rate.set(rate.get()))


@app.external(authorize=beaker.Authorize.only_creator())
def configure(reserve: abi.Application, asset: abi.Asset, rate_oracle: abi.Account):
    return Seq(
        app.state.reserve_id.set(reserve.application_id()),
        app.state.asset_id.set(asset.asset_id()),
        app.state.rate_oracle.set(rate_oracle.address()),
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: asset.asset_id(),
                TxnField.asset_amount: pt.Int(0),
                TxnField.sender: pt.Global.current_application_address(),
                TxnField.receiver: pt.Global.current_application_address(),
            }
        ),
    )


@pt.Subroutine(TealType.none)
def _mint(asset_id: Expr, amount: Expr, to: Expr):
    return Seq(
        pt.InnerTxnBuilder.MethodCall(
            app.state.reserve_id.get(), "mint", [asset_id, amount, to]
        )
    )


@app.external
def mint(asset: abi.AssetTransferTransaction, to: abi.Account):
    return Seq(
        Assert(
            asset.get().xfer_asset() == app.state.asset_id.get(),
            comment="asset not supported",
        ),
    )
