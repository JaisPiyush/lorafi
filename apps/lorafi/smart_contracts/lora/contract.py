import beaker
import pyteal as pt
from pyteal import Seq, Assert, TealType, TxnField, TxnType, Expr, abi


FACTOR = pt.Int(100_000)


class LoraState:
    asset_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    rate_oracle = beaker.GlobalStateValue(stack_type=TealType.bytes)
    rate = beaker.GlobalStateValue(stack_type=TealType.uint64)
    reserve_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    pt_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    yt_id = beaker.GlobalStateValue(stack_type=TealType.uint64)


app = beaker.Application("lora", state=LoraState())


@pt.Subroutine(TealType.uint64)
def is_rate_oracle(acct: Expr):
    return acct == app.state.rate_oracle.get()


@app.external(authorize=is_rate_oracle)
def update_rate(rate: abi.Uint64):
    return Seq(app.state.rate.set(rate.get()))


@pt.Subroutine(TealType.none)
def _transfer(asset_id: Expr, amount: Expr, sender: Expr, receiver: Expr) -> Expr:
    return pt.InnerTxnBuilder.Execute(
        {
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: asset_id,
            TxnField.asset_amount: amount,
            TxnField.sender: sender,
            TxnField.asset_receiver: receiver,
            TxnField.assets: [asset_id],
        }
    )


@app.external(authorize=beaker.Authorize.only_creator())
def configure(
    reserve: abi.Application,
    asset: abi.Asset,
    rate_oracle: abi.Account,
    _pt: abi.Asset,
    _yt: abi.Asset,
):
    return Seq(
        app.state.reserve_id.set(reserve.application_id()),
        app.state.asset_id.set(asset.asset_id()),
        app.state.rate_oracle.set(rate_oracle.address()),
        app.state.pt_id.set(_pt.asset_id()),
        app.state.yt_id.set(_yt.asset_id()),
        _transfer(
            asset.asset_id(),
            pt.Int(0),
            pt.Global.current_application_address(),
            pt.Global.current_application_address(),
        ),
        _transfer(
            _pt.asset_id(),
            pt.Int(0),
            pt.Global.current_application_address(),
            pt.Global.current_application_address(),
        ),
        _transfer(
            _yt.asset_id(),
            pt.Int(0),
            pt.Global.current_application_address(),
            pt.Global.current_application_address(),
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
                pt.Div(pt.Minus(FACTOR, app.state.rate.get()), FACTOR),
            ),
            pt.Mul(
                asset.get().asset_amount(),
                pt.Div(app.state.rate.get(), FACTOR),
            ),
            to,
        ),
    )


@app.external(authorize=beaker.Authorize.only_creator())
def mint_on_command(
    principal_amount: abi.Uint64, yield_amount: abi.Uint64, to: abi.Account
):
    return Seq(_mint(principal_amount.get(), yield_amount.get(), to))


@app.external
def burn(
    _pt: abi.AssetTransferTransaction,
    _yt: abi.AssetTransferTransaction,
    to: abi.Account,
):
    amount = pt.ScratchVar(TealType.uint64)
    return Seq(
        Assert(
            _pt.get().xfer_asset() == app.state.pt_id.get(),
            comment="principal token expected",
        ),
        Assert(
            _yt.get().xfer_asset() == app.state.yt_id.get(),
            comment="yield token expected",
        ),
        amount.store(
            pt.Mul(
                _pt.get().asset_amount(),
                pt.Div(FACTOR, pt.Minus(FACTOR, app.state.rate.get())),
            )
        ),
        pt.Assert(
            _yt.get().asset_amount() >= amount.load() - _pt.get().asset_amount(),
            comment="insufficient yield token",
        ),
        _transfer(
            app.state.asset_id.get(),
            amount.load(),
            pt.Global.current_application_address(),
            to.address(),
        ),
        pt.If(
            _yt.get().asset_amount() - amount.load() - _pt.get().asset_amount()
            > pt.Int(0),
            _transfer(
                _yt.get().xfer_asset(),
                _yt.get().asset_amount() - amount.load() - _pt.get().asset_amount(),
                pt.Global.current_application_address(),
                to.address(),
            ),
        ),
    )
