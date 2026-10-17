import type { PluginFlowNodeTypeDef } from "fat-notes-sdk";
import KnowledgeRetrievalNode from "../components/KnowledgeRetrievalNode/KnowledgeRetrievalNode";
import KnowledgeRetrievalNodeEdit from "../components/KnowledgeRetrievalNodeEdit/KnowledgeRetrievalNodeEdit";
import { basic } from "../flowsdk";

export const knowledgeRetrievalDef: PluginFlowNodeTypeDef = {
  type: "knowledgeRetrieval",
  name: "block.flow.node.knowledgeRetrieval.defaultName",
  iconType: "library",
  iconUrl: "",
  color: "#EB2F96",
  category: "think",
  theme: "dark",
  defaultDescription: "block.flow.type.knowledgeRetrieval.default.description",
  width: 360,
  height: 124,
  initDefaultNode: ({ node }) => {
    const tNode = node as LogicFlow.KnowledgeRetrievalNode;
    tNode.inParams = [{ id: basic.uuid(), name: "input", dataType: "string" }];
    tNode.knowledgeBaseIds = [];
    tNode.queryText = "";
    tNode.delayAfterAction = 0;

    const passagesId = basic.uuid();
    const contentId = basic.uuid();
    const rawId = basic.uuid();
    const timeUsedId = basic.uuid();
    tNode.outParams = [
      {
        id: passagesId,
        path: [passagesId],
        dataType: "arrObject",
        name: "passages",
        fieldKey: "passages",
      },
      {
        id: contentId,
        path: [contentId],
        dataType: "string",
        name: "content",
        fieldKey: "content",
      },
      {
        id: rawId,
        path: [rawId],
        dataType: "object",
        name: "raw",
        fieldKey: "raw",
      },
      {
        id: timeUsedId,
        path: [timeUsedId],
        dataType: "number",
        name: "time_used(ms)",
        fieldKey: "time_used(ms)",
      },
    ];
  },
  render: KnowledgeRetrievalNode,
  edit: KnowledgeRetrievalNodeEdit,
};
