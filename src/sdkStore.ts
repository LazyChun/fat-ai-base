import type { FatNotesPluginSDK } from "fat-notes-sdk";

let sdk: FatNotesPluginSDK | null = null;

export function setSdk(s: FatNotesPluginSDK): void {
  sdk = s;
}

export function getSdk(): FatNotesPluginSDK {
  if (!sdk) throw new Error("[sdkStore] SDK 未初始化（activate 之前被访问）");
  return sdk;
}
