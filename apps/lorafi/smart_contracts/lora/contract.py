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
def _mint(principal: Expr, yield_amount: Expr, to: abi.Account):
    return Seq(
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.ApplicationCall,
                TxnField.application_id: app.state.reserve_id.get(),
                TxnField.on_completion: pt.OnComplete.NoOp,
                TxnField.application_args: [
                    pt.Bytes("mint_yield_token_pair"),
                    principal,
                    yield_amount,
                    to.address(),
                ],
            }
        )
    )


@app.external
def mint(asset: abi.AssetTransferTransaction, to: abi.Account):
    return Seq(
        Assert(
            asset.get().xfer_asset() == app.state.asset_id.get(),
            comment="asset not supported",
        ),
        _mint(
            pt.Mul(
                asset.get().asset_amount(),
                pt.Div(
                    pt.Minus(pt.Int(100_000), app.state.rate.get()), pt.Int(100_000)
                ),
            ),
            pt.Mul(
                asset.get().asset_amount(),
                pt.Div(app.state.rate.get(), pt.Int(100_000)),
            ),
            to,
        ),
    )


@app.external(authorize=beaker.Authorize.only_creator())
def mint_on_command(
    principal_amount: abi.Uint64, yield_amount: abi.Uint64, to: abi.Account
):
    return Seq(_mint(principal_amount.get(), yield_amount.get(), to))
