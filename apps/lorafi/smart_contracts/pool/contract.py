import beaker
import pyteal as pt
from pyteal import abi, Seq, Assert, TealType, Expr, TxnField, TxnType


# / --- --- UNDERLYING ASA CONFIG
UNDERLYING_ASA_TOTAL = pt.Int(2**64 - 1)
UNDERLYING_ASA_DECIMALS = pt.Int(0)
UNDERLYING_ASA_DEFAULT_FROZEN = pt.Int(0)
UNDERLYING_ASA_MANAGER_ADDR = pt.Global.current_application_address()
UNDERLYING_ASA_RESERVE_ADDR = pt.Global.current_application_address()
UNDERLYING_ASA_FREEZE_ADDR = pt.Global.current_application_address()
UNDERLYING_ASA_CLAWBACK_ADDR = pt.Global.current_application_address()
MINIMUM_LIQUIDITY = pt.Int(10)


class PoolState:
    # Name in Token1-Token2 format
    name = beaker.GlobalStateValue(stack_type=TealType.bytes, descr="Name of the pool")
    has_configured = beaker.GlobalStateValue(
        stack_type=TealType.uint64, default=pt.Int(0)
    )
    asset_1_reserve = beaker.GlobalStateValue(
        stack_type=TealType.uint64, default=pt.Int(0)
    )
    asset_2_reserve = beaker.GlobalStateValue(
        stack_type=TealType.uint64, default=pt.Int(0)
    )
    asset_1_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    asset_2_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    lp_asset_id = beaker.GlobalStateValue(stack_type=TealType.uint64)
    k_constant = beaker.GlobalStateValue(stack_type=TealType.uint64, default=pt.Int(0))
    total_supply = beaker.GlobalStateValue(
        stack_type=TealType.uint64, default=pt.Int(0)
    )


app = beaker.Application("pool", state=PoolState())


@app.external(authorize=beaker.Authorize.only_creator())
def configure(
    name: abi.String, asset_1: abi.Asset, asset_2: abi.Asset, *, output: abi.Uint64
) -> Expr:
    return Seq(
        Assert(
            app.state.has_configured.get() == pt.Int(0),
            comment="Pool has already been configured",
        ),
        app.state.name.set(name.get()),
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: asset_1.asset_id(),
                TxnField.asset_amount: pt.Int(0),
                TxnField.sender: pt.Global.current_application_address(),
                TxnField.asset_receiver: pt.Global.current_application_address(),
            }
        ),
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: asset_2.asset_id(),
                TxnField.asset_amount: pt.Int(0),
                TxnField.sender: pt.Global.current_application_address(),
                TxnField.asset_receiver: pt.Global.current_application_address(),
            }
        ),
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetConfig,
                TxnField.config_asset_total: UNDERLYING_ASA_TOTAL,
                TxnField.config_asset_decimals: UNDERLYING_ASA_DECIMALS,
                TxnField.config_asset_default_frozen: UNDERLYING_ASA_DEFAULT_FROZEN,
                TxnField.config_asset_unit_name: pt.Bytes("LoraFiLP"),
                TxnField.config_asset_name: name.get(),
                TxnField.config_asset_manager: UNDERLYING_ASA_MANAGER_ADDR,
                TxnField.config_asset_reserve: UNDERLYING_ASA_RESERVE_ADDR,
                TxnField.config_asset_freeze: UNDERLYING_ASA_FREEZE_ADDR,
                TxnField.config_asset_clawback: UNDERLYING_ASA_CLAWBACK_ADDR,
            }
        ),
        app.state.lp_asset_id.set(pt.InnerTxn.created_asset_id()),
        app.state.asset_1_id.set(asset_1.asset_id()),
        app.state.asset_2_id.set(asset_2.asset_id()),
        app.state.has_configured.set(pt.Int(1)),
        output.set(app.state.lp_asset_id.get()),
    )


@app.external(read_only=True)
def get_lp_token_asset(*, output: abi.Uint64) -> Expr:
    return Seq(output.set(app.state.lp_asset_id.get()))


# TODO: (Fix) right now it assumes order of asset is consistent with state
@pt.Subroutine(TealType.none)
def pre_condition_asset_check(asset_1: Expr, asset_2: Expr) -> Expr:
    return Seq(
        Assert(
            pt.And(
                app.state.asset_1_id.get() != pt.Int(0),
                app.state.asset_2_id.get() != pt.Int(0),
            ),
            comment="assets are not defined",
        ),
        Assert(
            pt.And(
                pt.Or(
                    asset_1 == app.state.asset_1_id.get(),
                    # pt.Gtxn[0] == app.state.asset_2_id.get(),
                ),
                pt.Or(
                    asset_2 == app.state.asset_1_id.get(),
                    # asset_2.get() == app.state.asset_2_id.get(),
                ),
            ),
            comment="pool does not support asset",
        ),
    )


@pt.Subroutine(TealType.none)
def sync_k_constant():
    return pt.Seq(
        app.state.k_constant.set(
            app.state.asset_1_reserve.get() * app.state.asset_2_reserve.get()
        )
    )


@pt.Subroutine(TealType.none)
def _mint(address: Expr, amount: Expr) -> Expr:
    return Seq(
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: app.state.lp_asset_id.get(),
                # TxnField.sender: pt.Global.current_application_address(),
                TxnField.asset_receiver: address,
                TxnField.asset_amount: amount,
            }
        ),
        app.state.total_supply.set(app.state.total_supply.get() + amount),
    )


@pt.Subroutine(TealType.none)
def _transfer(asset: Expr, address: Expr, amount: Expr) -> Expr:
    return Seq(
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: asset,
                # TxnField.sender: pt.Global.current_application_address(),
                TxnField.asset_receiver: address,
                TxnField.asset_amount: amount,
            }
        )
    )


@pt.Subroutine(TealType.uint64)
def min(a: Expr, b: Expr) -> Expr:
    return Seq(pt.If(pt.Lt(a, b), pt.Return(a), pt.Return(b)))


@app.external
def deposit(
    to: abi.Account,
) -> Expr:
    liquidity = pt.ScratchVar(TealType.uint64)
    return Seq(
        # pre_condition_asset_check(pt.Gtxn[0].xfer_asset(), pt.Gtxn[1].xfer_asset()),
        pt.If(app.state.total_supply.get() == pt.Int(0))
        .Then(
            liquidity.store(
                pt.Sqrt(
                    pt.Minus(
                        pt.Mul(pt.Gtxn[0].asset_amount(), pt.Gtxn[1].asset_amount()),
                        MINIMUM_LIQUIDITY,
                    )
                )
            ),
            # _mint(pt.Global.zero_address(), MINIMUM_LIQUIDITY),
        )
        .Else(
            liquidity.store(
                min(
                    pt.Div(
                        pt.Mul(pt.Gtxn[0].asset_amount(), app.state.total_supply.get()),
                        app.state.asset_1_reserve.get(),
                    ),
                    pt.Div(
                        pt.Mul(pt.Gtxn[1].asset_amount(), app.state.total_supply.get()),
                        app.state.asset_2_reserve.get(),
                    ),
                )
            )
        ),
        app.state.asset_1_reserve.set(
            app.state.asset_1_reserve.get() + pt.Gtxn[0].asset_amount()
        ),
        app.state.asset_2_reserve.set(
            app.state.asset_2_reserve.get() + pt.Gtxn[1].asset_amount()
        ),
        _mint(to.address(), liquidity.load()),
        sync_k_constant(),
        pt.Approve(),
    )


@app.external
def burn(to: abi.Account):
    amount_1 = pt.ScratchVar(TealType.uint64)
    amount_2 = pt.ScratchVar(TealType.uint64)
    return Seq(
        Assert(
            pt.Gtxn[0].xfer_asset() == app.state.lp_asset_id.get(),
            comment="Not Pool LP Token",
        ),
        amount_1.store(
            pt.Div(
                pt.Mul(pt.Gtxn[0].asset_amount(), app.state.asset_1_reserve.get()),
                app.state.total_supply.get(),
            )
        ),
        amount_2.store(
            pt.Div(
                pt.Mul(pt.Gtxn[0].asset_amount(), app.state.asset_2_reserve.get()),
                app.state.total_supply.get(),
            )
        ),
        Assert(
            pt.And(amount_1.load() > pt.Int(0), amount_2.load() > pt.Int(0)),
            comment="insufficient liquidity burned",
        ),
        app.state.asset_1_reserve.set(
            app.state.asset_1_reserve.get() - amount_1.load()
        ),
        app.state.asset_2_reserve.set(
            app.state.asset_2_reserve.get() - amount_2.load()
        ),
        _transfer(app.state.asset_1_id.get(), to.address(), amount_1.load()),
        _transfer(app.state.asset_2_id.get(), to.address(), amount_2.load()),
        app.state.total_supply.set(
            app.state.total_supply.get() - pt.Gtxn[0].asset_amount()
        ),
        sync_k_constant(),
        pt.Approve(),
    )


@app.external(read_only=True)
def swap_quote(
    asset_amount: abi.Uint64, asset_id: abi.Uint64, *, output: abi.Uint64
) -> Expr:
    asset_in = pt.ScratchVar(TealType.uint64)
    asset_in_reserve = pt.ScratchVar(TealType.uint64)
    asset_out_reserve = pt.ScratchVar(TealType.uint64)
    asset_out = pt.ScratchVar(TealType.uint64)
    amount_out = pt.ScratchVar(TealType.uint64)
    return Seq(
        Assert(
            pt.Or(
                asset_id.get() == app.state.asset_1_id.get(),
                asset_id.get() == app.state.asset_2_id.get(),
            ),
            comment="asset not recognized",
        ),
        pt.If(
            asset_id.get() == app.state.asset_1_id.get(),
        )
        .Then(
            Seq(asset_in.store(app.state.asset_1_id.get())),
            asset_in_reserve.store(app.state.asset_1_reserve.get()),
            asset_out.store(app.state.asset_2_id.get()),
            asset_out_reserve.store(app.state.asset_2_reserve.get()),
        )
        .Else(
            Seq(asset_in.store(app.state.asset_2_id.get())),
            asset_in_reserve.store(app.state.asset_2_reserve.get()),
            asset_out.store(app.state.asset_1_id.get()),
            asset_out_reserve.store(app.state.asset_1_reserve.get()),
        ),
        amount_out.store(
            pt.Minus(
                asset_out_reserve.load(),
                pt.Div(
                    app.state.k_constant.get(),
                    pt.Add(asset_in_reserve.load(), asset_amount.get()),
                ),
            )
        ),
        Assert(
            amount_out.load() < asset_out_reserve.load(),
            comment="insufficient liquidity",
        ),
        output.set(amount_out.load()),
    )


@app.external
def swap(to: abi.Account):
    asset_in = pt.ScratchVar(TealType.uint64)
    asset_in_reserve = pt.ScratchVar(TealType.uint64)
    asset_out_reserve = pt.ScratchVar(TealType.uint64)
    asset_out = pt.ScratchVar(TealType.uint64)
    amount_out = pt.ScratchVar(TealType.uint64)
    return Seq(
        Assert(
            pt.Or(
                pt.Gtxn[0].xfer_asset() == app.state.asset_1_id.get(),
                pt.Gtxn[0].xfer_asset() == app.state.asset_2_id.get(),
            ),
            comment="asset not recognized",
        ),
        pt.If(
            pt.Gtxn[0].xfer_asset() == app.state.asset_1_id.get(),
        )
        .Then(
            Seq(asset_in.store(app.state.asset_1_id.get())),
            asset_in_reserve.store(app.state.asset_1_reserve.get()),
            asset_out.store(app.state.asset_2_id.get()),
            asset_out_reserve.store(app.state.asset_2_reserve.get()),
        )
        .Else(
            Seq(asset_in.store(app.state.asset_2_id.get())),
            asset_in_reserve.store(app.state.asset_2_reserve.get()),
            asset_out.store(app.state.asset_1_id.get()),
            asset_out_reserve.store(app.state.asset_1_reserve.get()),
        ),
        amount_out.store(
            pt.Minus(
                asset_out_reserve.load(),
                pt.Div(
                    app.state.k_constant.get(),
                    pt.Add(asset_in_reserve.load(), pt.Gtxn[0].asset_amount()),
                ),
            )
        ),
        Assert(
            amount_out.load() < asset_out_reserve.load(),
            comment="insufficient liquidity",
        ),
        pt.If(pt.Gtxn[0].xfer_asset() == app.state.asset_1_id.get())
        .Then(
            app.state.asset_1_reserve.set(
                app.state.asset_1_reserve.get() + pt.Gtxn[0].asset_amount()
            ),
            app.state.asset_2_reserve.set(
                app.state.asset_2_reserve.get() - amount_out.load()
            ),
        )
        .Else(
            app.state.asset_2_reserve.set(
                app.state.asset_2_reserve.get() + pt.Gtxn[0].asset_amount()
            ),
            app.state.asset_1_reserve.set(
                app.state.asset_1_reserve.get() - amount_out.load()
            ),
        ),
        _transfer(asset_out.load(), to.address(), amount_out.load()),
    )
