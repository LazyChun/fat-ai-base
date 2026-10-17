import type { Disposable, FatNotesPluginSDK } from "fat-notes-sdk";
import { setSdk } from "./sdkStore";
import { initFlowSdk } from "./flowsdk";
import { flowNodeDefs } from "./flowNodes";
import AiKnowledgeBaseSettings from "./aiSettings/AiKnowledgeBaseSettings";
import AiOcrSettings from "./aiSettings/AiOcrSettings";

const disposables: Disposable[] = [];

export async function activate(sdk: FatNotesPluginSDK): Promise<void> {
  setSdk(sdk);
  initFlowSdk();
  for (const def of flowNodeDefs) {
    disposables.push(sdk.contributions.registerFlowNodeType(def));
  }
  disposables.push(
    sdk.contributions.registerAiSettingsSection({
      id: "kb",
      i18nTitleKey: "ai.manage.tab.kb",
      order: 2,
      render: () => <AiKnowledgeBaseSettings />,
    }),
  );
  disposables.push(
    sdk.contributions.registerAiSettingsSection({
      id: "ocr",
      i18nTitleKey: "ai.manage.tab.ocr",
      order: 1,
      render: () => <AiOcrSettings />,
    }),
  );
}

export function deactivate(): void {
  while (disposables.length) {
    try {
      disposables.pop()?.dispose();
    } catch (e) {
      console.warn("[fat-ai-base] dispose error", e);
    }
  }
}
