/* eslint-disable */
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  CoreAppCallArgs,
  RawAppCallArgs,
  AppState,
  TealTemplateParams,
  ABIAppCallArg,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom } from '@algorandfoundation/algokit-utils/types/transaction'
import type { TransactionWithSigner } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer } from 'algosdk'
export const APP_SPEC: AppSpec = {
  "hints": {
    "update_rate(uint64)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "configure(application,asset,account,asset,asset)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "mint(axfer,account)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "mint_on_command(uint64,uint64,account)void": {
      "call_config": {
        "no_op": "CALL"
      }
    },
    "burn(axfer,axfer,account)void": {
      "call_config": {
        "no_op": "CALL"
      }
    }
  },
  "source": {
    "approval": "I3ByYWdtYSB2ZXJzaW9uIDgKaW50Y2Jsb2NrIDAgMSAxMDAwMDAgNApieXRlY2Jsb2NrIDB4NzI2MTc0NjUgMHg2MTczNzM2NTc0NWY2OTY0IDB4NzI2MTc0NjU1ZjZmNzI2MTYzNmM2NSAweDcyNjU3MzY1NzI3NjY1NWY2OTY0IDB4NzA3NDVmNjk2NCAweDc5NzQ1ZjY5NjQKdHhuIE51bUFwcEFyZ3MKaW50Y18wIC8vIDAKPT0KYm56IG1haW5fbDEyCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MDI2NTlmNDggLy8gInVwZGF0ZV9yYXRlKHVpbnQ2NCl2b2lkIgo9PQpibnogbWFpbl9sMTEKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMApwdXNoYnl0ZXMgMHg3M2M0ZjU5YyAvLyAiY29uZmlndXJlKGFwcGxpY2F0aW9uLGFzc2V0LGFjY291bnQsYXNzZXQsYXNzZXQpdm9pZCIKPT0KYm56IG1haW5fbDEwCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4M2Y2ZmU2MmQgLy8gIm1pbnQoYXhmZXIsYWNjb3VudCl2b2lkIgo9PQpibnogbWFpbl9sOQp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDBlNTk4M2RkIC8vICJtaW50X29uX2NvbW1hbmQodWludDY0LHVpbnQ2NCxhY2NvdW50KXZvaWQiCj09CmJueiBtYWluX2w4CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4Y2ZkMDJiYmIgLy8gImJ1cm4oYXhmZXIsYXhmZXIsYWNjb3VudCl2b2lkIgo9PQpibnogbWFpbl9sNwplcnIKbWFpbl9sNzoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKY2FsbHN1YiBidXJuY2FzdGVyXzEyCmludGNfMSAvLyAxCnJldHVybgptYWluX2w4Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIG1pbnRvbmNvbW1hbmRjYXN0ZXJfMTEKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDk6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CmNhbGxzdWIgbWludGNhc3Rlcl8xMAppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTA6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CmNhbGxzdWIgY29uZmlndXJlY2FzdGVyXzkKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDExOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIHVwZGF0ZXJhdGVjYXN0ZXJfOAppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTI6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KYm56IG1haW5fbDE0CmVycgptYWluX2wxNDoKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKPT0KYXNzZXJ0CmludGNfMSAvLyAxCnJldHVybgoKLy8gaXNfcmF0ZV9vcmFjbGUKaXNyYXRlb3JhY2xlXzA6CnByb3RvIDEgMQpmcmFtZV9kaWcgLTEKYnl0ZWNfMiAvLyAicmF0ZV9vcmFjbGUiCmFwcF9nbG9iYWxfZ2V0Cj09CnJldHN1YgoKLy8gdXBkYXRlX3JhdGUKdXBkYXRlcmF0ZV8xOgpwcm90byAxIDAKdHhuIFNlbmRlcgpjYWxsc3ViIGlzcmF0ZW9yYWNsZV8wCi8vIHVuYXV0aG9yaXplZAphc3NlcnQKYnl0ZWNfMCAvLyAicmF0ZSIKZnJhbWVfZGlnIC0xCmFwcF9nbG9iYWxfcHV0CnJldHN1YgoKLy8gX3RyYW5zZmVyCnRyYW5zZmVyXzI6CnByb3RvIDQgMAppdHhuX2JlZ2luCmludGNfMyAvLyBheGZlcgppdHhuX2ZpZWxkIFR5cGVFbnVtCmZyYW1lX2RpZyAtNAppdHhuX2ZpZWxkIFhmZXJBc3NldApmcmFtZV9kaWcgLTMKaXR4bl9maWVsZCBBc3NldEFtb3VudApmcmFtZV9kaWcgLTIKaXR4bl9maWVsZCBTZW5kZXIKZnJhbWVfZGlnIC0xCml0eG5fZmllbGQgUmVjZWl2ZXIKaXR4bl9zdWJtaXQKcmV0c3ViCgovLyBjb25maWd1cmUKY29uZmlndXJlXzM6CnByb3RvIDUgMAp0eG4gU2VuZGVyCmdsb2JhbCBDcmVhdG9yQWRkcmVzcwo9PQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CmJ5dGVjXzMgLy8gInJlc2VydmVfaWQiCmZyYW1lX2RpZyAtNQp0eG5hcyBBcHBsaWNhdGlvbnMKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMSAvLyAiYXNzZXRfaWQiCmZyYW1lX2RpZyAtNAp0eG5hcyBBc3NldHMKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMiAvLyAicmF0ZV9vcmFjbGUiCmZyYW1lX2RpZyAtMwp0eG5hcyBBY2NvdW50cwphcHBfZ2xvYmFsX3B1dApieXRlYyA0IC8vICJwdF9pZCIKZnJhbWVfZGlnIC0yCnR4bmFzIEFzc2V0cwphcHBfZ2xvYmFsX3B1dApieXRlYyA1IC8vICJ5dF9pZCIKZnJhbWVfZGlnIC0xCnR4bmFzIEFzc2V0cwphcHBfZ2xvYmFsX3B1dApieXRlY18xIC8vICJhc3NldF9pZCIKYXBwX2dsb2JhbF9nZXQKaW50Y18wIC8vIDAKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKY2FsbHN1YiB0cmFuc2Zlcl8yCmZyYW1lX2RpZyAtMgp0eG5hcyBBc3NldHMKaW50Y18wIC8vIDAKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKY2FsbHN1YiB0cmFuc2Zlcl8yCmZyYW1lX2RpZyAtMQp0eG5hcyBBc3NldHMKaW50Y18wIC8vIDAKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKY2FsbHN1YiB0cmFuc2Zlcl8yCnJldHN1YgoKLy8gX21pbnQKbWludF80Ogpwcm90byAzIDAKaXR4bl9iZWdpbgpwdXNoaW50IDYgLy8gYXBwbAppdHhuX2ZpZWxkIFR5cGVFbnVtCmJ5dGVjXzMgLy8gInJlc2VydmVfaWQiCmFwcF9nbG9iYWxfZ2V0Cml0eG5fZmllbGQgQXBwbGljYXRpb25JRAppbnRjXzAgLy8gTm9PcAppdHhuX2ZpZWxkIE9uQ29tcGxldGlvbgpwdXNoYnl0ZXMgMHg2ZDY5NmU3NDVmNzk2OTY1NmM2NDVmNzQ2ZjZiNjU2ZTVmNzA2MTY5NzIgLy8gIm1pbnRfeWllbGRfdG9rZW5fcGFpciIKaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKZnJhbWVfZGlnIC0zCml0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCmZyYW1lX2RpZyAtMgppdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwpmcmFtZV9kaWcgLTEKdHhuYXMgQWNjb3VudHMKaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKaXR4bl9zdWJtaXQKcmV0c3ViCgovLyBtaW50Cm1pbnRfNToKcHJvdG8gMiAwCmZyYW1lX2RpZyAtMgpndHhucyBYZmVyQXNzZXQKYnl0ZWNfMSAvLyAiYXNzZXRfaWQiCmFwcF9nbG9iYWxfZ2V0Cj09Ci8vIGFzc2V0IG5vdCBzdXBwb3J0ZWQKYXNzZXJ0CmZyYW1lX2RpZyAtMgpndHhucyBBc3NldEFtb3VudAppbnRjXzIgLy8gMTAwMDAwCmJ5dGVjXzAgLy8gInJhdGUiCmFwcF9nbG9iYWxfZ2V0Ci0KaW50Y18yIC8vIDEwMDAwMAovCioKZnJhbWVfZGlnIC0yCmd0eG5zIEFzc2V0QW1vdW50CmJ5dGVjXzAgLy8gInJhdGUiCmFwcF9nbG9iYWxfZ2V0CmludGNfMiAvLyAxMDAwMDAKLwoqCmZyYW1lX2RpZyAtMQpjYWxsc3ViIG1pbnRfNApyZXRzdWIKCi8vIG1pbnRfb25fY29tbWFuZAptaW50b25jb21tYW5kXzY6CnByb3RvIDMgMAp0eG4gU2VuZGVyCmdsb2JhbCBDcmVhdG9yQWRkcmVzcwo9PQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CmZyYW1lX2RpZyAtMwpmcmFtZV9kaWcgLTIKZnJhbWVfZGlnIC0xCmNhbGxzdWIgbWludF80CnJldHN1YgoKLy8gYnVybgpidXJuXzc6CnByb3RvIDMgMApmcmFtZV9kaWcgLTMKZ3R4bnMgWGZlckFzc2V0CmJ5dGVjIDQgLy8gInB0X2lkIgphcHBfZ2xvYmFsX2dldAo9PQovLyBwcmluY2lwYWwgdG9rZW4gZXhwZWN0ZWQKYXNzZXJ0CmZyYW1lX2RpZyAtMgpndHhucyBYZmVyQXNzZXQKYnl0ZWMgNSAvLyAieXRfaWQiCmFwcF9nbG9iYWxfZ2V0Cj09Ci8vIHlpZWxkIHRva2VuIGV4cGVjdGVkCmFzc2VydApmcmFtZV9kaWcgLTMKZ3R4bnMgQXNzZXRBbW91bnQKaW50Y18yIC8vIDEwMDAwMAppbnRjXzIgLy8gMTAwMDAwCmJ5dGVjXzAgLy8gInJhdGUiCmFwcF9nbG9iYWxfZ2V0Ci0KLwoqCnN0b3JlIDAKZnJhbWVfZGlnIC0yCmd0eG5zIEFzc2V0QW1vdW50CmxvYWQgMApmcmFtZV9kaWcgLTMKZ3R4bnMgQXNzZXRBbW91bnQKLQo+PQovLyBpbnN1ZmZpY2llbnQgeWllbGQgdG9rZW4KYXNzZXJ0CmJ5dGVjXzEgLy8gImFzc2V0X2lkIgphcHBfZ2xvYmFsX2dldApsb2FkIDAKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKZnJhbWVfZGlnIC0xCnR4bmFzIEFjY291bnRzCmNhbGxzdWIgdHJhbnNmZXJfMgpmcmFtZV9kaWcgLTIKZ3R4bnMgQXNzZXRBbW91bnQKbG9hZCAwCi0KZnJhbWVfZGlnIC0zCmd0eG5zIEFzc2V0QW1vdW50Ci0KaW50Y18wIC8vIDAKPgpieiBidXJuXzdfbDIKZnJhbWVfZGlnIC0yCmd0eG5zIFhmZXJBc3NldApmcmFtZV9kaWcgLTIKZ3R4bnMgQXNzZXRBbW91bnQKbG9hZCAwCi0KZnJhbWVfZGlnIC0zCmd0eG5zIEFzc2V0QW1vdW50Ci0KZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKZnJhbWVfZGlnIC0xCnR4bmFzIEFjY291bnRzCmNhbGxzdWIgdHJhbnNmZXJfMgpidXJuXzdfbDI6CnJldHN1YgoKLy8gdXBkYXRlX3JhdGVfY2FzdGVyCnVwZGF0ZXJhdGVjYXN0ZXJfODoKcHJvdG8gMCAwCmludGNfMCAvLyAwCnR4bmEgQXBwbGljYXRpb25BcmdzIDEKYnRvaQpmcmFtZV9idXJ5IDAKZnJhbWVfZGlnIDAKY2FsbHN1YiB1cGRhdGVyYXRlXzEKcmV0c3ViCgovLyBjb25maWd1cmVfY2FzdGVyCmNvbmZpZ3VyZWNhc3Rlcl85Ogpwcm90byAwIDAKaW50Y18wIC8vIDAKZHVwbiA0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpmcmFtZV9idXJ5IDAKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgppbnRjXzAgLy8gMApnZXRieXRlCmZyYW1lX2J1cnkgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAzCmludGNfMCAvLyAwCmdldGJ5dGUKZnJhbWVfYnVyeSAyCnR4bmEgQXBwbGljYXRpb25BcmdzIDQKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpmcmFtZV9idXJ5IDMKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQppbnRjXzAgLy8gMApnZXRieXRlCmZyYW1lX2J1cnkgNApmcmFtZV9kaWcgMApmcmFtZV9kaWcgMQpmcmFtZV9kaWcgMgpmcmFtZV9kaWcgMwpmcmFtZV9kaWcgNApjYWxsc3ViIGNvbmZpZ3VyZV8zCnJldHN1YgoKLy8gbWludF9jYXN0ZXIKbWludGNhc3Rlcl8xMDoKcHJvdG8gMCAwCmludGNfMCAvLyAwCmR1cAp0eG5hIEFwcGxpY2F0aW9uQXJncyAxCmludGNfMCAvLyAwCmdldGJ5dGUKZnJhbWVfYnVyeSAxCnR4biBHcm91cEluZGV4CmludGNfMSAvLyAxCi0KZnJhbWVfYnVyeSAwCmZyYW1lX2RpZyAwCmd0eG5zIFR5cGVFbnVtCmludGNfMyAvLyBheGZlcgo9PQphc3NlcnQKZnJhbWVfZGlnIDAKZnJhbWVfZGlnIDEKY2FsbHN1YiBtaW50XzUKcmV0c3ViCgovLyBtaW50X29uX2NvbW1hbmRfY2FzdGVyCm1pbnRvbmNvbW1hbmRjYXN0ZXJfMTE6CnByb3RvIDAgMAppbnRjXzAgLy8gMApkdXBuIDIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpidG9pCmZyYW1lX2J1cnkgMAp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmJ0b2kKZnJhbWVfYnVyeSAxCnR4bmEgQXBwbGljYXRpb25BcmdzIDMKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpmcmFtZV9idXJ5IDIKZnJhbWVfZGlnIDAKZnJhbWVfZGlnIDEKZnJhbWVfZGlnIDIKY2FsbHN1YiBtaW50b25jb21tYW5kXzYKcmV0c3ViCgovLyBidXJuX2Nhc3RlcgpidXJuY2FzdGVyXzEyOgpwcm90byAwIDAKaW50Y18wIC8vIDAKZHVwbiAyCnR4bmEgQXBwbGljYXRpb25BcmdzIDEKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpmcmFtZV9idXJ5IDIKdHhuIEdyb3VwSW5kZXgKcHVzaGludCAyIC8vIDIKLQpmcmFtZV9idXJ5IDAKZnJhbWVfZGlnIDAKZ3R4bnMgVHlwZUVudW0KaW50Y18zIC8vIGF4ZmVyCj09CmFzc2VydAp0eG4gR3JvdXBJbmRleAppbnRjXzEgLy8gMQotCmZyYW1lX2J1cnkgMQpmcmFtZV9kaWcgMQpndHhucyBUeXBlRW51bQppbnRjXzMgLy8gYXhmZXIKPT0KYXNzZXJ0CmZyYW1lX2RpZyAwCmZyYW1lX2RpZyAxCmZyYW1lX2RpZyAyCmNhbGxzdWIgYnVybl83CnJldHN1Yg==",
    "clear": "I3ByYWdtYSB2ZXJzaW9uIDgKcHVzaGludCAwIC8vIDAKcmV0dXJu"
  },
  "state": {
    "global": {
      "num_byte_slices": 1,
      "num_uints": 5
    },
    "local": {
      "num_byte_slices": 0,
      "num_uints": 0
    }
  },
  "schema": {
    "global": {
      "declared": {
        "asset_id": {
          "type": "uint64",
          "key": "asset_id",
          "descr": ""
        },
        "pt_id": {
          "type": "uint64",
          "key": "pt_id",
          "descr": ""
        },
        "rate": {
          "type": "uint64",
          "key": "rate",
          "descr": ""
        },
        "rate_oracle": {
          "type": "bytes",
          "key": "rate_oracle",
          "descr": ""
        },
        "reserve_id": {
          "type": "uint64",
          "key": "reserve_id",
          "descr": ""
        },
        "yt_id": {
          "type": "uint64",
          "key": "yt_id",
          "descr": ""
        }
      },
      "reserved": {}
    },
    "local": {
      "declared": {},
      "reserved": {}
    }
  },
  "contract": {
    "name": "lora",
    "methods": [
      {
        "name": "update_rate",
        "args": [
          {
            "type": "uint64",
            "name": "rate"
          }
        ],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "configure",
        "args": [
          {
            "type": "application",
            "name": "reserve"
          },
          {
            "type": "asset",
            "name": "asset"
          },
          {
            "type": "account",
            "name": "rate_oracle"
          },
          {
            "type": "asset",
            "name": "_pt"
          },
          {
            "type": "asset",
            "name": "_yt"
          }
        ],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "mint",
        "args": [
          {
            "type": "axfer",
            "name": "asset"
          },
          {
            "type": "account",
            "name": "to"
          }
        ],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "mint_on_command",
        "args": [
          {
            "type": "uint64",
            "name": "principal_amount"
          },
          {
            "type": "uint64",
            "name": "yield_amount"
          },
          {
            "type": "account",
            "name": "to"
          }
        ],
        "returns": {
          "type": "void"
        }
      },
      {
        "name": "burn",
        "args": [
          {
            "type": "axfer",
            "name": "_pt"
          },
          {
            "type": "axfer",
            "name": "_yt"
          },
          {
            "type": "account",
            "name": "to"
          }
        ],
        "returns": {
          "type": "void"
        }
      }
    ],
    "networks": {}
  },
  "bare_call_config": {
    "no_op": "CREATE"
  }
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp =  { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn =  { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut =  { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp =  { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp =  { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt 
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

/**
 * Defines the types of available calls and state of the Lora smart contract.
 */
export type Lora = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods:
    & Record<'update_rate(uint64)void' | 'update_rate', {
      argsObj: {
        rate: bigint | number
      }
      argsTuple: [rate: bigint | number]
      returns: void
    }>
    & Record<'configure(application,asset,account,asset,asset)void' | 'configure', {
      argsObj: {
        reserve: number | bigint
        asset: number | bigint
        rate_oracle: string | Uint8Array
        _pt: number | bigint
        _yt: number | bigint
      }
      argsTuple: [reserve: number | bigint, asset: number | bigint, rate_oracle: string | Uint8Array, _pt: number | bigint, _yt: number | bigint]
      returns: void
    }>
    & Record<'mint(axfer,account)void' | 'mint', {
      argsObj: {
        asset: TransactionToSign | Transaction | Promise<SendTransactionResult>
        to: string | Uint8Array
      }
      argsTuple: [asset: TransactionToSign | Transaction | Promise<SendTransactionResult>, to: string | Uint8Array]
      returns: void
    }>
    & Record<'mint_on_command(uint64,uint64,account)void' | 'mint_on_command', {
      argsObj: {
        principal_amount: bigint | number
        yield_amount: bigint | number
        to: string | Uint8Array
      }
      argsTuple: [principal_amount: bigint | number, yield_amount: bigint | number, to: string | Uint8Array]
      returns: void
    }>
    & Record<'burn(axfer,axfer,account)void' | 'burn', {
      argsObj: {
        _pt: TransactionToSign | Transaction | Promise<SendTransactionResult>
        _yt: TransactionToSign | Transaction | Promise<SendTransactionResult>
        to: string | Uint8Array
      }
      argsTuple: [_pt: TransactionToSign | Transaction | Promise<SendTransactionResult>, _yt: TransactionToSign | Transaction | Promise<SendTransactionResult>, to: string | Uint8Array]
      returns: void
    }>
  /**
   * Defines the shape of the global and local state of the application.
   */
  state: {
    global: {
      'asset_id'?: IntegerState
      'pt_id'?: IntegerState
      'rate'?: IntegerState
      'rate_oracle'?: BinaryState
      'reserve_id'?: IntegerState
      'yt_id'?: IntegerState
    }
  }
}
/**
 * Defines the possible abi call signatures
 */
export type LoraSig = keyof Lora['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends LoraSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams & CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the Lora smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends LoraSig> = Lora['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the Lora smart contract to the method's return type
 */
export type MethodReturn<TSignature extends LoraSig> = Lora['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type LoraCreateCalls = (typeof LoraCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type LoraCreateCallParams =
  | (TypedCallParams<undefined> & (OnCompleteNoOp))
/**
 * Defines arguments required for the deploy method.
 */
export type LoraDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: LoraCreateCalls) => LoraCreateCallParams
}


/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class LoraCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the lora smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & (OnCompleteNoOp) = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the update_rate(uint64)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static updateRate(args: MethodArgs<'update_rate(uint64)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'update_rate(uint64)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.rate],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the configure(application,asset,account,asset,asset)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static configure(args: MethodArgs<'configure(application,asset,account,asset,asset)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'configure(application,asset,account,asset,asset)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.reserve, args.asset, args.rate_oracle, args._pt, args._yt],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the mint(axfer,account)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static mint(args: MethodArgs<'mint(axfer,account)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'mint(axfer,account)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.asset, args.to],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the mint_on_command(uint64,uint64,account)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static mintOnCommand(args: MethodArgs<'mint_on_command(uint64,uint64,account)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'mint_on_command(uint64,uint64,account)void' as const,
      methodArgs: Array.isArray(args) ? args : [args.principal_amount, args.yield_amount, args.to],
      ...params,
    }
  }
  /**
   * Constructs a no op call for the burn(axfer,axfer,account)void ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static burn(args: MethodArgs<'burn(axfer,axfer,account)void'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'burn(axfer,axfer,account)void' as const,
      methodArgs: Array.isArray(args) ? args : [args._pt, args._yt, args.to],
      ...params,
    }
  }
}

/**
 * A client to make calls to the lora smart contract
 */
export class LoraClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `LoraClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(appDetails: AppDetails, private algod: Algodv2) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient({
      ...appDetails,
      app: APP_SPEC
    }, algod)
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn>(result: AppCallTransactionResult, returnValueFormatter?: (value: any) => TReturn): AppCallTransactionResultOfType<TReturn> {
    if(result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue = result.return?.returnValue !== undefined && returnValueFormatter !== undefined
      ? returnValueFormatter(result.return.returnValue)
      : result.return?.returnValue as TReturn | undefined
      return { ...result, return: returnValue }
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof Lora['methods']>(typedCallParams: TypedCallParams<TSignature>, returnValueFormatter?: (value: any) => MethodReturn<TSignature>) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the lora smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: LoraDeployArgs & AppClientDeployCoreParams = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(LoraCallFactory.create)
    return this.appClient.deploy({
      ...params,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the lora smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      bare(args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs & (OnCompleteNoOp) = {}): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.create(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the lora smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the update_rate(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public updateRate(args: MethodArgs<'update_rate(uint64)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(LoraCallFactory.updateRate(args, params))
  }

  /**
   * Calls the configure(application,asset,account,asset,asset)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public configure(args: MethodArgs<'configure(application,asset,account,asset,asset)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(LoraCallFactory.configure(args, params))
  }

  /**
   * Calls the mint(axfer,account)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public mint(args: MethodArgs<'mint(axfer,account)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(LoraCallFactory.mint(args, params))
  }

  /**
   * Calls the mint_on_command(uint64,uint64,account)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public mintOnCommand(args: MethodArgs<'mint_on_command(uint64,uint64,account)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(LoraCallFactory.mintOnCommand(args, params))
  }

  /**
   * Calls the burn(axfer,axfer,account)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public burn(args: MethodArgs<'burn(axfer,axfer,account)void'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(LoraCallFactory.burn(args, params))
  }

  /**
   * Extracts a binary state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns A BinaryState instance containing the state value, or undefined if the key was not found
   */
  private static getBinaryState(state: AppState, key: string): BinaryState | undefined {
    const value = state[key]
    if (!value) return undefined
    if (!('valueRaw' in value))
      throw new Error(`Failed to parse state value for ${key}; received an int when expected a byte array`)
    return {
      asString(): string {
        return value.value
      },
      asByteArray(): Uint8Array {
        return value.valueRaw
      }
    }
  }

  /**
   * Extracts a integer state value out of an AppState dictionary
   *
   * @param state The state dictionary containing the state value
   * @param key The key of the state value
   * @returns An IntegerState instance containing the state value, or undefined if the key was not found
   */
  private static getIntegerState(state: AppState, key: string): IntegerState | undefined {
    const value = state[key]
    if (!value) return undefined
    if ('valueRaw' in value)
      throw new Error(`Failed to parse state value for ${key}; received a byte array when expected a number`)
    return {
      asBigInt() {
        return typeof value.value === 'bigint' ? value.value : BigInt(value.value)
      },
      asNumber(): number {
        return typeof value.value === 'bigint' ? Number(value.value) : value.value
      },
    }
  }

  /**
   * Returns the smart contract's global state wrapped in a strongly typed accessor with options to format the stored value
   */
  public async getGlobalState(): Promise<Lora['state']['global']> {
    const state = await this.appClient.getGlobalState()
    return {
      get asset_id() {
        return LoraClient.getIntegerState(state, 'asset_id')
      },
      get pt_id() {
        return LoraClient.getIntegerState(state, 'pt_id')
      },
      get rate() {
        return LoraClient.getIntegerState(state, 'rate')
      },
      get rate_oracle() {
        return LoraClient.getBinaryState(state, 'rate_oracle')
      },
      get reserve_id() {
        return LoraClient.getIntegerState(state, 'reserve_id')
      },
      get yt_id() {
        return LoraClient.getIntegerState(state, 'yt_id')
      },
    }
  }

  public compose(): LoraComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain:Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      updateRate(args: MethodArgs<'update_rate(uint64)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.updateRate(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      configure(args: MethodArgs<'configure(application,asset,account,asset,asset)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.configure(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      mint(args: MethodArgs<'mint(axfer,account)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.mint(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      mintOnCommand(args: MethodArgs<'mint_on_command(uint64,uint64,account)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.mintOnCommand(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      burn(args: MethodArgs<'burn(axfer,axfer,account)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.burn(args, {...params, sendParams: {...params?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({...args, sendParams: {...args?.sendParams, skipSending: true, atc}}))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom) {
        promiseChain = promiseChain.then(async () => atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)))
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async execute() {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams: {} }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)
        }
      }
    } as unknown as LoraComposer
  }
}
export type LoraComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the update_rate(uint64)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  updateRate(args: MethodArgs<'update_rate(uint64)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs): LoraComposer<[...TReturns, MethodReturn<'update_rate(uint64)void'>]>

  /**
   * Calls the configure(application,asset,account,asset,asset)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  configure(args: MethodArgs<'configure(application,asset,account,asset,asset)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs): LoraComposer<[...TReturns, MethodReturn<'configure(application,asset,account,asset,asset)void'>]>

  /**
   * Calls the mint(axfer,account)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  mint(args: MethodArgs<'mint(axfer,account)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs): LoraComposer<[...TReturns, MethodReturn<'mint(axfer,account)void'>]>

  /**
   * Calls the mint_on_command(uint64,uint64,account)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  mintOnCommand(args: MethodArgs<'mint_on_command(uint64,uint64,account)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs): LoraComposer<[...TReturns, MethodReturn<'mint_on_command(uint64,uint64,account)void'>]>

  /**
   * Calls the burn(axfer,axfer,account)void ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  burn(args: MethodArgs<'burn(axfer,axfer,account)void'>, params?: AppClientCallCoreParams & CoreAppCallArgs): LoraComposer<[...TReturns, MethodReturn<'burn(axfer,axfer,account)void'>]>

  /**
   * Makes a clear_state call to an existing instance of the lora smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs): LoraComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>, defaultSender?: SendTransactionFrom): LoraComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Executes the transaction group and returns an array of results
   */
  execute(): Promise<LoraComposerResults<TReturns>>
}
export type LoraComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
