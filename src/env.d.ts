declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

import type { OpenDialogOptions, SaveDialogOptions } from 'electron';

interface MyAPI {
  doAThing: () => void
  selectInputFile: () => Promise<string | null>
  selectOutputDir: () => Promise<string | null>
  transformFile: (
    inputPath: string,
    outputDir: string
  ) => Promise<{ outPath: string; original: any[]; transformed: any[] }>
}

declare global {
  interface Window {
    myAPI: MyAPI;
  }
}
