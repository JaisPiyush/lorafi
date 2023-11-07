import beaker
import pyteal as pt
from pyteal import abi, TxnField, TxnType, Expr


# / --- --- UNDERLYING ASA CONFIG
UNDERLYING_ASA_TOTAL = pt.Int(2**64 - 1)
UNDERLYING_ASA_DECIMALS = pt.Int(0)
UNDERLYING_ASA_DEFAULT_FROZEN = pt.Int(1)
UNDERLYING_ASA_MANAGER_ADDR = pt.Global.current_application_address()
UNDERLYING_ASA_RESERVE_ADDR = pt.Global.current_application_address()
UNDERLYING_ASA_FREEZE_ADDR = pt.Global.current_application_address()
UNDERLYING_ASA_CLAWBACK_ADDR = pt.Global.current_application_address()


class ReserveState:
    portable_asset_id = beaker.GlobalStateValue(stack_type=pt.TealType.uint64)
    portal_asset_commander = beaker.GlobalStateValue(stack_type=pt.TealType.bytes)
    principal_token_id = beaker.GlobalStateValue(stack_type=pt.TealType.uint64)
    yield_token_id = beaker.GlobalStateValue(stack_type=pt.TealType.uint64)
    usdt_token_id = beaker.GlobalStateValue(stack_type=pt.TealType.uint64)
    market_token_commander = beaker.GlobalStateValue(stack_type=pt.TealType.bytes)
    usdt_token_commander = beaker.GlobalStateValue(stack_type=pt.TealType.bytes)

    def __init__(self) -> None:
        self.usdt_token_commander.set(pt.Txn.sender())


app = beaker.Application("reserve", state=ReserveState())


@app.external(authorize=beaker.Authorize.only_creator())
def set_portal_asset_data(asset: abi.Asset, commander: abi.Account):
    return pt.Seq(
        app.state.portable_asset_id.set(asset.asset_id()),
        app.state.portal_asset_commander.set(commander.address()),
    )


@app.external(authorize=beaker.Authorize.only_creator())
def set_market_token(
    principal_token: abi.Asset, yield_token: abi.Asset, commander: abi.Account
) -> Expr:
    return pt.Seq(
        app.state.principal_token_id.set(principal_token.asset_id()),
        app.state.yield_token_id.set(yield_token.asset_id()),
        app.state.market_token_commander.set(commander.address()),
    )


@app.external(authorize=beaker.Authorize.only_creator())
def set_usdt_token(asset: abi.Asset, commander: abi.Account) -> Expr:
    return pt.Seq(
        app.state.usdt_token_id.set(asset.asset_id()),
        app.state.usdt_token_commander.set(commander.address()),
    )


# @pt.Subroutine(pt.TealType.none)
# def create_asa_inner_tx(
#     name: abi.String, unit_name: abi.String, url: abi.String, output: abi.Uint64
# ) -> Expr:
#     return pt.Seq(
#         pt.InnerTxnBuilder.Execute(
#             {
#                 TxnField.type_enum: TxnType.AssetConfig,
#                 TxnField.config_asset_total: UNDERLYING_ASA_TOTAL,
#                 TxnField.config_asset_decimals: UNDERLYING_ASA_DECIMALS,
#                 TxnField.config_asset_default_frozen: UNDERLYING_ASA_DEFAULT_FROZEN,
#                 TxnField.config_asset_unit_name: unit_name.get(),
#                 TxnField.config_asset_name: name.get(),
#                 TxnField.config_asset_url: url.get(),
#                 TxnField.config_asset_manager: UNDERLYING_ASA_MANAGER_ADDR,
#                 TxnField.config_asset_reserve: UNDERLYING_ASA_RESERVE_ADDR,
#                 TxnField.config_asset_freeze: UNDERLYING_ASA_FREEZE_ADDR,
#                 TxnField.config_asset_clawback: UNDERLYING_ASA_CLAWBACK_ADDR,
#             }
#         ),
#         output.set(pt.InnerTxn.created_asset_id()),
#     )


## Fix return value is zero
@app.external(authorize=beaker.Authorize.only_creator())
def create_asa(
    name: abi.String, unit_name: abi.String, url: abi.String, *, output: abi.Uint64
):
    return pt.Seq(
        pt.InnerTxnBuilder.Execute(
            {
                TxnField.type_enum: TxnType.AssetConfig,
                TxnField.config_asset_total: UNDERLYING_ASA_TOTAL,
                TxnField.config_asset_decimals: UNDERLYING_ASA_DECIMALS,
                TxnField.config_asset_default_frozen: UNDERLYING_ASA_DEFAULT_FROZEN,
                TxnField.config_asset_unit_name: unit_name.get(),
                TxnField.config_asset_name: name.get(),
                TxnField.config_asset_url: url.get(),
                TxnField.config_asset_manager: UNDERLYING_ASA_MANAGER_ADDR,
                TxnField.config_asset_reserve: UNDERLYING_ASA_RESERVE_ADDR,
                TxnField.config_asset_freeze: UNDERLYING_ASA_FREEZE_ADDR,
                TxnField.config_asset_clawback: UNDERLYING_ASA_CLAWBACK_ADDR,
            }
        ),
        output.set(pt.InnerTxn.created_asset_id()),
    )


@pt.Subroutine(pt.TealType.none)
def asa_mint_inner_txn(
    asset: pt.abi.Asset, receiver: pt.abi.Account, amount: abi.Uint64
) -> Expr:
    return pt.InnerTxnBuilder.Execute(
        {
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: asset.asset_id(),
            TxnField.asset_amount: amount.get(),
            TxnField.asset_sender: pt.Global.current_application_address(),
            TxnField.asset_receiver: receiver.address(),
        }
    )


# @pt.Subroutine(pt.TealType.none)
# def pre_condition_checks(asset: abi.Asset) -> Expr:
#     sender = pt.Txn.sender()
#     asset_id = asset.asset_id()
#     return pt.Seq(
#         pt.Assert(
#             pt.Or(
#                 app.state.principal_token_id.get() == asset_id,
#                 app.state.principal_token_id.get() == asset_id,
#                 app.state.yield_token_id.get() == asset_id,
#                 app.state.usdt_token_id.get() == asset_id,
#             ),
#             comment="asset is not controlled by the reserve",
#         ),
#         pt.Assert(
#             pt.Or(
#                 app.state.portal_asset_commander.get() == sender,
#                 app.state.market_token_commander.get() == sender,
#                 app.state.usdt_token_commander.get() == sender,
#             )
#         ),
#     )


@app.external
def mint(asset: abi.Asset, asset_amount: pt.abi.Uint64, asset_receiver: pt.abi.Account):
    return pt.Seq(
        [
            asa_mint_inner_txn(asset, asset_receiver, asset_amount),
        ]
    )
