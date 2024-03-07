export type UserType = 0 | 1 | 10;

interface SocialPlatform {
    user_instagram_url: string;
    user_facebook_url: string;
    user_twitter_url: string;
    user_of_url: string;
}

export interface User {
    id: number;
    user_name: string;
    user_email: string;
    user_wallet: string;
    wallet_crypto_symbol: string;
    novu_subscriber_id: string;
    user_type: UserType;
    last_login: string;
}

export interface UserProfile extends User, SocialPlatform {
    user_description: string;
    followers: number;
    following: number;
    is_following?: boolean;
    created_at: string;
}


export interface UserStorage {
    id?: number;
    token?: string;
    user_name?: string;
    user_email?: string;
    user_wallet?: string;
    wallet_crypto_symbol?: string;
    novu_subscriber_id?: string;
    user_type?: UserType;
    last_login?: string; 
}