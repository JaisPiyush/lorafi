interface Chain {
    name: string;
    url: string;
}

interface Token {
    name: string;
    symbol: string;
    url: string;
    assetId: number
}

export enum Chains {
    Polygon = 'polygon',
    Algorand = 'algorand'
}

export enum Tokens {
    aDai = 'aDAI',
    USDT = 'USDT',
    PT_aDai = 'PT-aDAI',
    YT_aDai = 'YT-aDAI'
}

export const algorandAppId = {
    "Pool" : 477943147,
    'Reserve' :480793896,
    'aDAI' : 480838208,
    'PT_aDAI' : 480838351,
    'YT_aDAI' : 480838406,
    'USDT' : 477748394,
    'Lora' : 480816361

} as const;

export const appAddress = {
    'Lora': "ROXVY7LRU2CXNFOCVZZRWO37N7AT46RSSUOGFXK3GCBONQYSPHOSGF7WNM"
} as const
// export const pools = {
    
// }


export const chainsRecord: Record<string, Chain> = {
    [Chains.Polygon]: {
        name: 'Polygon',
        url: 'https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo.webp'
    },
    [Chains.Algorand]: {
        name: 'Algorand',
        url: 'https://logowik.com/content/uploads/images/algorand-algo-icon9956.logowik.com.webp'
    }
};
export const tokensRecord: Record<string, Token> = {
    [Tokens.aDai]: {
        name: 'aDai',
        symbol: 'aDai',
        url: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        assetId: algorandAppId.aDAI
    },
    [Tokens.USDT]: {
        name: 'USDT',
        symbol: 'USDT',
        url: 'https://www.worldcryptoindex.com/wp-content/uploads/2018/01/usdt-logo-300.png',
        assetId: algorandAppId.USDT
    },
    [Tokens.PT_aDai]: {
        name: 'PT-aDAI',
        symbol: 'PT-aDAI',
        url: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        assetId: algorandAppId.PT_aDAI
    },
    [Tokens.YT_aDai]: {
        name: 'YT-aDAI',
        symbol: 'YT-aDAI',
        url: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
        assetId: algorandAppId.YT_aDAI
    },
}





export const pools = [
    // PT-aDAI/YT-aDAI
    478989570
] as const


export const poolAssets: Record<string, {token: Tokens, pool: number }[]> = {
    [Tokens.PT_aDai]: [
        {token: Tokens.YT_aDai, pool: pools[0]}
    ]
}