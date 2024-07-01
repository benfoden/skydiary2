/* eslint-disable @typescript-eslint/no-empty-interface */
import type en from "messages/en.json";

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}

import { type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      stripeCustomerId: string;
      isSubscriber: boolean;
    };
  }
  interface User extends DefaultUser {
    stripeCustomerId: string;
    isSubscriber: boolean;
  }
}
