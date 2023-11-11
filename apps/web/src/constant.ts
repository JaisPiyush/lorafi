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
    aDai = 'aDai',
    USDT = 'USDT'
}

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
        assetId: 2
    },
    [Tokens.USDT]: {
        name: 'USDT',
        symbol: 'USDT',
        url: 'https://www.worldcryptoindex.com/wp-content/uploads/2018/01/usdt-logo-300.png',
        assetId: 4
    }
}