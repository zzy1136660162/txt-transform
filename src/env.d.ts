declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

import type { OpenDialogOptions, SaveDialogOptions } from 'electron';

interface MyAPI {
  doAThing: () => void;
}

declare global {
  interface Window {
    myAPI: MyAPI;
  }
}
