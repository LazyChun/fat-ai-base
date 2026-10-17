/*
 * 宿主 flow 组件桥接层：被迁移组件原本 import 宿主的 "hooks"/"components"/
 * "utils"/"contexts"/"enums"/"reducers/*"/"../base"。宿主经 MF 只共享
 * react/antd 等基础库，业务模块经 sdk.remoteComponents.FlowEditCommon /
 * FlowNodeCommon 暴露。remote 加载时组件模块先于 activate 求值，故用
 * export let 占位 + initFlowSdk() 重绑。
 */
import { getSdk } from "./sdkStore";

const notReady =
  (name: string) =>
  (..._args: unknown[]) => {
    throw new Error(`[flowsdk] ${name} 在 activate 之前被调用`);
  };

/* hooks / redux */
// useFlowNode 带泛型签名：迁移组件以 useFlowNode<T>() 形式调用，
// 纯 any 声明会触发 TS2347（Untyped function calls may not accept type arguments）。
export let useFlowNode: <T = any>() => any = notReady("useFlowNode");
export let useI18n: any = notReady("useI18n");
export let useAppDispatch: any = notReady("useAppDispatch");
export let useAppSelector: (selector: (state: any) => any) => any =
  notReady("useAppSelector");
export let fetchAiConf: any = notReady("fetchAiConf");
/* context */
export let FlowNodeContext: any = notReady("FlowNodeContext");
/* 通用组件 */
export let FatForm: any = notReady("FatForm");
export let EasyVarInput: any = notReady("EasyVarInput");
export let VarInput: any = notReady("VarInput");
export let Tip: any = notReady("Tip");
export let Icon: any = notReady("Icon");
export let EllipsisText: any = notReady("EllipsisText");
export let FatJsonEditor: any = notReady("FatJsonEditor");
export let IconType: any = notReady("IconType");
/* utils */
// requests 需带泛型签名：迁移组件以 requests.post<T>() 形式调用，
// 纯 any 声明会触发 TS2347（Untyped function calls may not accept type arguments）。
interface RequestsShim {
  get<T = any>(url: string, params?: object, headers?: any): Promise<Resp<T>>;
  post<T = any>(
    url: string,
    params?: object | FormData,
    headers?: any,
  ): Promise<Resp<T>>;
  put<T = any>(url: string, params?: object, headers?: any): Promise<Resp<T>>;
  delete<T = any>(
    url: string,
    params?: object,
    headers?: any,
  ): Promise<Resp<T>>;
}
export let requests: RequestsShim = notReady(
  "requests",
) as unknown as RequestsShim;
export let basic: any = notReady("basic");
/* FlowEditDrawer base（编辑组件原 "../base"）*/
export let ActionsAfterDone: any = notReady("ActionsAfterDone");
export let VarsInputs: any = notReady("VarsInputs");
export let VarsOutputs: any = notReady("VarsOutputs");
export let FlowCollapse: any = notReady("FlowCollapse");
export let VarValue: any = notReady("VarValue");
export let VarName: any = notReady("VarName");
export let VarSelector: any = notReady("VarSelector");
export let BlockLine: any = notReady("BlockLine");
export let FlowIcon: any = notReady("FlowIcon");
export let ErrorHandle: any = notReady("ErrorHandle");
export let ErrorOutput: any = notReady("ErrorOutput");
export let VarParams: any = notReady("VarParams");
export let DsTableSelector: any = notReady("DsTableSelector");
export let DsConditions: any = notReady("DsConditions");
export let DsColsUpdate: any = notReady("DsColsUpdate");
export let BasicConditions: any = notReady("BasicConditions");
export let BasicFlowNodeEdit: any = notReady("BasicFlowNodeEdit");
export let ErrorIgnore: any = notReady("ErrorIgnore");
export let MousePosPicker: any = notReady("MousePosPicker");
export let MouseRegionPicker: any = notReady("MouseRegionPicker");
export let MouseColorPicker: any = notReady("MouseColorPicker");
export let MouseTextPicker: any = notReady("MouseTextPicker");
export let WebElementSelectorPicker: any = notReady("WebElementSelectorPicker");
export let ModelSelect: any = notReady("ModelSelect");
export let FrameStyleEdit: any = notReady("FrameStyleEdit");
/* BlockFlowNode base（渲染组件原 "../base"）*/
export let InputTags: any = notReady("InputTags");
export let OutputTags: any = notReady("OutputTags");
export let DotRegion: any = notReady("DotRegion");
/* AI settings（AiSettingsPage 插件区块组件依赖）*/
export let addKnowledgeBase: any = notReady("addKnowledgeBase");
export let editKnowledgeBase: any = notReady("editKnowledgeBase");
export let deleteKnowledgeBase: any = notReady("deleteKnowledgeBase");
export let reorderKnowledgeBases: any = notReady("reorderKnowledgeBases");
export let addOcr: any = notReady("addOcr");
export let editOcr: any = notReady("editOcr");
export let deleteOcr: any = notReady("deleteOcr");
export let reorderOcrs: any = notReady("reorderOcrs");
export let setDefaultOcr: any = notReady("setDefaultOcr");
export let IconButton: any = notReady("IconButton");
export let AiSettingsEmpty: any = notReady("AiSettingsEmpty");
export let getServerBase: any = notReady("getServerBase");
export let TIME_FORMAT: any = notReady("TIME_FORMAT");

export function initFlowSdk(): void {
  const rc = (getSdk() as any).remoteComponents;
  const F = rc.FlowEditCommon;
  const N = rc.FlowNodeCommon;
  useFlowNode = F.useFlowNode;
  useI18n = F.useI18n;
  useAppDispatch = F.useAppDispatch;
  useAppSelector = F.useAppSelector;
  fetchAiConf = F.fetchAiConf;
  FlowNodeContext = F.FlowNodeContext;
  FatForm = F.FatForm;
  EasyVarInput = F.EasyVarInput;
  VarInput = F.VarInput;
  Tip = F.Tip;
  Icon = F.Icon;
  EllipsisText = F.EllipsisText;
  FatJsonEditor = F.FatJsonEditor;
  IconType = F.IconType;
  requests = F.requests;
  basic = F.basic;
  ActionsAfterDone = F.ActionsAfterDone;
  VarsInputs = F.VarsInputs;
  VarsOutputs = F.VarsOutputs;
  FlowCollapse = F.FlowCollapse;
  VarValue = F.VarValue;
  VarName = F.VarName;
  VarSelector = F.VarSelector;
  BlockLine = F.BlockLine;
  FlowIcon = F.FlowIcon;
  ErrorHandle = F.ErrorHandle;
  ErrorOutput = F.ErrorOutput;
  VarParams = F.VarParams;
  DsTableSelector = F.DsTableSelector;
  DsConditions = F.DsConditions;
  DsColsUpdate = F.DsColsUpdate;
  BasicConditions = F.BasicConditions;
  BasicFlowNodeEdit = F.BasicFlowNodeEdit;
  ErrorIgnore = F.ErrorIgnore;
  MousePosPicker = F.MousePosPicker;
  MouseRegionPicker = F.MouseRegionPicker;
  MouseColorPicker = F.MouseColorPicker;
  MouseTextPicker = F.MouseTextPicker;
  WebElementSelectorPicker = F.WebElementSelectorPicker;
  ModelSelect = F.ModelSelect;
  FrameStyleEdit = F.FrameStyleEdit;
  addKnowledgeBase = F.addKnowledgeBase;
  editKnowledgeBase = F.editKnowledgeBase;
  deleteKnowledgeBase = F.deleteKnowledgeBase;
  reorderKnowledgeBases = F.reorderKnowledgeBases;
  addOcr = F.addOcr;
  editOcr = F.editOcr;
  deleteOcr = F.deleteOcr;
  reorderOcrs = F.reorderOcrs;
  setDefaultOcr = F.setDefaultOcr;
  IconButton = F.IconButton;
  AiSettingsEmpty = F.AiSettingsEmpty;
  getServerBase = F.getServerBase;
  TIME_FORMAT = F.TIME_FORMAT;
  InputTags = N.InputTags;
  OutputTags = N.OutputTags;
  DotRegion = N.DotRegion;
}
