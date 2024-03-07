import type { Signal } from "@builder.io/qwik";
import type { PublicWish, Wish } from "../wish";

export const WishArrayMock: Signal<Wish[]> = {
  value: [
    {
      id: 1,
      wish_description:
        "blabla blablablablablablablablablablablabla blablablablablablablablablablablabla blabla blabla blabla v blabla blabla blabla blabla blabla",
      wish_name: "asdass",
      wish_end_date: "14/05/2013",
      wish_price: 100,
      wish_taken_by_user: "", // or the correct value
      wish_contribution: 0, // or the correct value
      wish_find_link: "",
      wish_public: 0,
      user_type: 0,
      wish_comments: [
        {
          id: 1,
          comment_text: "asta",
          user_name: "anonymous",
          comment_date: "14/05/2013",
          likes: 2,
          user_id: 1,
          wish_id: 1,
          user_type: 0,
        },
      ],
      wishbox_name: "",
      wish_likes: 2,
      user_id: 1,
      user_name: "anonymous",
      crypto_symbol: "ETH",
      wishbox_id: 1,
      user_wallet: "",
      liked: false,
    },
    {
      id: 1,
      wish_description:
        "blabla blablablablablablablablablablablabla blablablablablablablablablablablabla blabla blabla blabla v blabla blabla blabla blabla blabla",
      wish_name: "asdass",
      wish_end_date: "14/05/2013",
      wish_price: 100,
      wish_taken_by_user: "", // or the correct value
      wish_contribution: 0, // or the correct value
      wish_find_link: "",
      wish_public: 0,
      user_type: 0,
      wish_comments: [
        {
          id: 1,
          comment_text: "asta",
          user_name: "anonymous",
          comment_date: "14/05/2013",
          likes: 2,
          user_type: 0,
          user_id: 1,
          wish_id: 1,
        },
      ],
      wishbox_name: "",
      crypto_symbol: "ETH",
      wish_likes: 0,
      user_id: 1,
      user_name: "anonymous",
      wishbox_id: 1,
      user_wallet: "",
      liked: false,
    },
    {
      id: 1,
      wish_description:
        "blabla blablablablablablablablablablablabla blablablablablablablablablablablabla blabla blabla blabla v blabla blabla blabla blabla blabla",
      wish_name: "asdass",
      wish_end_date: "14/05/2013",
      wish_price: 100,
      wish_taken_by_user: "", // or the correct value
      wish_contribution: 0, // or the correct value
      wish_find_link: "",
      wish_public: 1,
      user_type: 0,
      wishbox_name: "",
      wish_comments: [
        {
          id: 1,
          comment_text: "asta",
          user_name: "anonymous",
          comment_date: "14/05/2013",
          likes: 2,
          user_id: 1,
          wish_id: 1,
          user_type: 0,
        },
      ],
      wish_likes: 0,
      crypto_symbol: "ETH",
      user_id: 1,
      user_name: "anonymous",
      wishbox_id: 1,
      user_wallet: "",
      liked: false,
    },
  ],
};

export const PublicWishMock: PublicWish = {
  id: 1,
  wish_description:
    "blabla blablablablablablablablablablablabla blablablablablablablablablablablabla blabla blabla blabla v blabla blabla blabla blabla blabla blabla blablablablablablablablablablablabla blablablablablablablablablablablabla blabla blabla blabla v blabla blabla blabla blabla blabla",
  wish_name: "asdass",
  wish_end_date: "14/05/2013",
  wish_price: 100,
  wish_taken_by_user: 0, // or the correct value
  wish_contribution: 0, // or the correct value
  wish_comments: [
    {
      id: 1,
      comment_text: "asta",
      user_name: "anonymous",
      comment_date: "14/05/2013",
      likes: 2,
      user_id: 1,
      wish_id: 1,
      user_type: 0,
    },
    {
      id: 1,
      comment_text: "asta",
      user_name: "anonymous",
      comment_date: "14/05/2013",
      likes: 2,
      user_id: 1,
      wish_id: 1,
      user_type: 0,
    },
    {
      id: 1,
      comment_text: "asta",
      user_name: "anonymous",
      comment_date: "14/05/2013",
      likes: 2,
      user_id: 1,
      wish_id: 1,
      user_type: 0,
    },
    {
      id: 1,
      comment_text: "asta",
      user_name: "anonymous",
      comment_date: "14/05/2013",
      likes: 2,
      user_id: 1,
      wish_id: 1,
      user_type: 0,
    },
    {
      id: 1,
      comment_text: "asta",
      user_name: "anonymous",
      comment_date: "14/05/2013",
      likes: 2,
      user_id: 1,
      wish_id: 1,
      user_type: 0,
    },
  ],
  wish_likes: 0,
  user_id: 1,
  user_name: "anonymous",
  user_wallet: "",
  user_instagram_url: "",
  user_facebook_url: "",
  user_twitter_url: "",
  user_of_url: "",
  is_following: false,
  liked: false,
};

// export const WishMockArray: Wish[] = [
//     {
//         id: 1,
//         wish_description: "blablabla",
//         wish_name: "asdass",
//         wish_end_date: "14/05/2013",
//         wish_price: 100,
//         wish_taken_by_user: 0, // or the correct value
//         wish_contribution: 0,  // or the correct value
//         wish_public: 0,
//         wish_find_link: '',
//         wish_comment: [
//             {
//                 id: 1,
//                 comment_text: "asta",
//                 user_name: "anonymous",
//                 comment_date: "14/05/2013",
//                 likes: 2,
//                 user_id: 1,
//                 wish_id: 1,
//             },
//         ],
//         wish_likes: 0,
//         user_id: 1,
//         user_name: "anonymous",
//         wishbox_id: 1,
//     },
//     {
//         id: 2,
//         wish_description: "blabla",
//         wish_name: "asdass",
//         wish_end_date: "14/05/2013",
//         wish_price: 1000,
//         wish_taken_by_user: 0, // or the correct value
//         wish_contribution: 0,  // or the correct value
//         wish_public: 0,
//         wish_find_link: '',
//         wish_comment: [
//             {
//                 id: 1,
//                 comment_text: "asta",
//                 user_name: "anonymous",
//                 comment_date: "14/05/2013",
//                 likes: 2,
//                 user_id: 1,
//                 wish_id: 2,
//             },
//         ],
//         wish_likes: 0,
//         user_id: 1,
//         user_name: "anonymous",
//         wishbox_id: 1,
//     },
// ];
