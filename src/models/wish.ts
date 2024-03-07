import type { UserType } from "./user";

export interface WishComments {
    id: number;
    comment_text: string;
    user_name: string;
    user_type: UserType;
    comment_date: string;
    likes: number;
    user_id: number;
    wish_id: number;
}

export interface Wish {
    id: number;
    wish_description: string;
    wish_find_link: string;
    wish_end_date: string;
    wish_price: number;
    wish_taken_by_user?: string;
    wish_pic_name?: string;
    wish_contribution: number;
    wish_public: 0 | 1;
    wish_name?: string;
    wishbox_name?: string;
    wishbox_id?: number;
    wish_likes: number;
    user_name: string;
    user_id: number;
    user_wallet: string;
    user_type: UserType;
    crypto_symbol: string;
    wish_comments: WishComments[];
    liked: boolean;
    enabled_ens?: boolean;
    new?: boolean;
    edited?: boolean;
}

export interface PublicWish {
    wish_name: string;
    wish_description: string;
    id: number;
    wish_end_date: string;
    wish_likes: number;
    wish_price: number;
    wish_taken_by_user: number;
    wish_contribution: number;
    user_name: string;
    user_id: number;
    user_wallet: string;
    wish_comments: WishComments[];
    user_instagram_url: string;
    user_facebook_url: string;
    user_twitter_url: string;
    user_of_url: string;
    is_following: boolean;
    liked: boolean;
}