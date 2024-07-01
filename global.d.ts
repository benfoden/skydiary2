/* eslint-disable @typescript-eslint/no-empty-interface */
import type en from "messages/en.json";

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}

// declare module "next-auth" {
//   interface Session {
//     user?: User & {
//       id: string;
//       stripeCustomerId: string;
//       isSubscriber: boolean;
//     };
//   }
//   // interface User extends DefaultUser {
//   //   stripeCustomerId: string;
//   //   isSubscriber: boolean;
//   // }
// }
