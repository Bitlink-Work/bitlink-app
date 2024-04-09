import { PublicKey } from "@solana/web3.js";

/** COMMON */
export interface IPagination {
    page: number;
    page_size: number;
    num_of_page: number;
}

/** LEADER BOARD */
export interface ILeaderBoardModel {
    rank: number;
    address: string;
    point: number;
}

export interface ILeaderBoardArrayModel {
    items: ILeaderBoardModel[];
    pagination: IPagination;
    loading: boolean;
    num_of_page: number;
}

/** MY NFTS */
export interface IMyNFTModel {
    token_id: number;
    address: string;
    name: string;
    type: number;
    created_time: number;
    rarity: number;
    price: string;
    token_uri: string;
    is_staking: boolean;
}

export interface IMyNFTsArrayModel {
    items: IMyNFTModel[];
    pagination: IPagination;
    loading: boolean;
}

/** WALLET */
export interface IWalletModel {
    address: string;
    chainId: number;
    balance: string;
    easyWeb3: any | void;
}

export interface WalletState {
    isOpenModal: boolean;
    connected: boolean;
    loading: boolean;
    provider: any;
    profile: any;
    addressWallet: string | any;
    chainId: number;
    connectorType: string;
    option: {
        gmail?: boolean;
        evm?: boolean;
    };
}

export interface IProfileModel {
    signature: string;
    public_address: string;
    nonce: string;
    device_id: string;
    xrip: string;
    access_token: string;
}

export interface IFormCreateCollectionModel {
    name: string | string[] | undefined;
    symbol: string | string[] | undefined;
    user_template_id: string | string[] | undefined;
}

export interface IFromCreateNftDetail {}
export interface IFormNftsModel {
    _id?: string;
    name?: string;
    media: { path: string; name: string };
    price: string | any;
    supply: string;
    // nft_name?: string;
    // nft_description?: string;
    properties: IProperties[];
    actions: IActions[];
}

export interface IProperties {
    type: string;
    name: string;
}
export interface IActions {
    name: string;
}

export interface ISignInParams {
    signature: string;
    nonce: string;
    public_address: string;
    chain_id: number | string;
}

export interface Template {
    template: string;
}

export interface NFTModel {
    nft_id: number;
    chain_id: number | string;
    contract: string;
    index_type: number;
    currency: string;
    currency_address: string;
    dapp_creator_address: string;
    deploy_address: string;
    factory_address: string;

    name: string;
    highlight_text: string;
    image_url: string;

    discount: number;
    price: number;
    supply: number | any;
    sold: number | any;
    whitelist: IwhiteList;
}

export interface IPromotionCart {
    code: string;
    discount: number;
}

export interface IwhiteList {
    end_time: number;
    start_time: number;
}
export interface ICartModel {
    items: NFTModel[];
    quantity: number | any;
    promotion: IPromotionCart | any;
    maxAmountMint: number | any;
    addressNFT: string | any;
    userNFT: NFTModel | any;
    addressCreator: string | any;
    addressFactory: string | any;
    payToken: string | any;
    totalSupply: number | any;
    totalSold: number | any;
    whiteListNFT:
        | {
              end_time: number;
              start_time: number;
          }
        | any;
    _refCode: string | any;
    _ref_p_code: string | any;
}
