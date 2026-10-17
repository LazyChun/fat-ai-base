namespace LogicFlow {
  export interface Pos {
    w: number;
    h: number;
    x: number;
    y: number;
  }

  // 错误处理配置
  export interface ErrorHandling {
    // 超时时间
    timeLimit: number;
    // 重试次数
    retryTimes: number;
    // 异常处理方式  break-中断 customReturn-返回设定内容 excuteErrorWay-执行异常流程
    exceptionHandling: "break" | "customReturn" | "excuteErrorWay" | string;
    // 自定义返回内容  在exceptionHandling为customReturn时有效
    customReturnContent?: string;
  }

  // 节点锚点
  export interface Dot {
    id: string;
    position: "left" | "top" | "right" | "bottom" | string;
    // 关联对象id 比如说ifConditionId 在多点情况下确定对应的条件走势 当refType为ifCondition,refId值为else时，表示其余条件
    refId?: string;
    // 关联对象类型 eg:ifCondition
    refType?: string;
  }

  // 引用变量配置
  export interface VarRef {
    // 引用参数id
    paramId: string;
    // 变量类型 page-本页 system-系统 flow-流程节点 varGroup-变量分组 expression-表达式变量 alarm-告警变量
    varType: string;
    // 引用节点id
    nodeId?: string;
    // 引用线id
    lineId?: string;
  }

  export interface Param {
    id: string;
    // 参数名称
    name?: string;
    // 参数数据类型
    dataType: string;
    // 参数值 当value = $[varRef]& 时，表示为变量引用
    value?: string;
    // 参数说明
    description?: string;
    // 引用变量
    varRef?: VarRef;
  }

  export interface InParam extends Param {
    // 是否必填 输入节点等使用
    required?: boolean;
  }

  // 输入产生
  export type InParams = InParam[];

  interface OutParam extends Param {
    // 父级参数id
    parentId?: string;
    // 子变量路径
    path?: string[];
    // 子变量字段
    fieldKey?: string;
    // 数据格式示例
    mockData?: string;
  }

  // 输出参数
  export type OutParams = OutParam[];

  // 逻辑流节点
  export interface Node {
    // 唯一id
    id: string;
    // 节点位置配置
    pos: Pos;
    // 节点名称
    name: string;
    // 节点类型
    type: NodeType | string;
    // 锚点出入点方向  leftToRight-左进右出 rightToLeft-右进左出 topToBottom-上进下出 bottomToTop下进上出
    dotsDirection:
      | "leftToRight"
      | "rightToLeft"
      | "topToBottom"
      | "bottomToTop"
      | string;
    // 节点锚点  一般为4个 上 下 左 右
    dots: Dot[];
    // 入参
    inParams: InParams;
    // 出参
    outParams: OutParams;
    // 异常处理
    errorHandling?: ErrorHandling;
    // 节点描述
    description: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
    // 隐藏节点标题栏 静态节点(注释/背景板等)可用
    hideTitle?: boolean;
  }

  // 卡片类型
  export enum NodeType {
    // 文本节点
    text = "text",
    // json序列化 用于把变量串转化为JSON字符
    inToJson = "inToJson",
    // json反序列化 用于把JSON字符串转化为变量
    jsonToOut = "jsonToOut",
    // 变量聚合节点
    variableGroups = "variableGroups",
    // 输入点节点
    in = "in",
    // 输出点节点
    out = "out",
    // if节点
    if = "if",
    // 等待节点
    wait = "wait",
    // log节点
    log = "log",
    // http节点
    http = "http",
    // 代码节点
    code = "code",
    // 新增ds数据
    dsAdd = "dsAdd",
    // 删除ds数据
    dsDelete = "dsDelete",
    // 更新ds数据
    dsUpdate = "dsUpdate",
    // 查询ds数据
    dsQuery = "dsQuery",
    // 消息发送节点
    msgSend = "msgSend",
    // 消息接收节点
    msgReceive = "msgReceive",
    // 开始节点
    start = "start",
    // 结束节点
    end = "end",
    // 循环节点
    loop = "loop",
    // 表达式节点
    expression = "expression",
    // 列表处理节点
    listVar = "listVar",
    // 迭代节点
    iteration = "iteration",
    // 退出循环节点
    endLoop = "endLoop",
    // ETL 工作流节点
    etlFlow = "etlFlow",
    // 屏幕任务工作流节点
    screenFlow = "screenFlow",
    // 思维工作流
    thinkFlow = "thinkFlow",
    // 屏幕找图
    scFindImg = "scFindImg",
    // 屏幕找色
    scFindColor = "scFindColor",
    // 文字识别
    scFindText = "scFindText",
    // 鼠标点击
    scMouseClick = "scMouseClick",
    // 鼠标移动
    scMouseMove = "scMouseMove",
    // 键盘点击
    scKeyboardClick = "scKeyboardClick",
    // 文本输入
    scInput = "scInput",
    // 鼠标滚轮
    scScroll = "scScroll",
    // 截屏
    scScreenshot = "scScreenshot",
    // 写入剪切板
    scWriteToClipboard = "scWriteToClipboard",
    // 读取剪切板
    scReadFromClipboard = "scReadFromClipboard",
    // 性能指标
    computerPerformance = "computerPerformance",
    // 记忆写入
    memoryWrite = "memoryWrite",
    // 记忆查询
    memoryRead = "memoryRead",
    // 控制台执行
    consoleRun = "consoleRun",
    // 播放音频
    playAudio = "playAudio",
    // 播放视频
    playVideo = "playVideo",
    // 音频转码
    audioTranscode = "audioTranscode",
    // 视频转码
    videoTranscode = "videoTranscode",
    // 图片转码
    imageTranscode = "imageTranscode",
    // 注释节点
    annotation = "annotation",
    // 富文本节点
    richText = "richText",
    // 背景板节点
    backdrop = "backdrop",
    // 画板节点
    drawingBoard = "drawingBoard",
  }

  // 节点连接线
  export interface Line {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    fromDotId: string;
    toDotId: string;
  }

  export interface IfConditionItem {
    id: string;
    // equal:=  notEqual:<>  greater:>  less:<  greaterOrEqual:>=  lessOrEqual:<= contain:包含  notContain:不包含
    operation: string;
    // 条件值 可输入变量
    value?: string;
    // 比较值 可输入变量
    compareValue?: string;
  }

  export interface IfCondition {
    id: string;
    logicOperation: "and" | "or" | string;
    items: IfConditionItem[];
  }

  // If 逻辑节点
  export interface IfNode extends Node {
    conditions: IfCondition[];
  }

  // 代码 逻辑节点
  export interface CodeNode extends Node {
    // 语言类型
    codeType: "javascript" | "python" | string;
    // 代码内容
    code?: string;
    // outParams自动同步时对应的code快照（用于避免未改code时重置用户编辑）
    outParamsCode?: string;
    outParamsCodeType?: string;
  }

  export interface DsCondition extends IfCondition {
    name: string;
  }

  export interface DsBasicNode extends Node {
    // 数据源id
    dsId?: string;
    // 数据表id
    dsTableId?: string;
    // 条件关系
    conditionsLogicOperation: "and" | "or" | string;
    // 相关条件
    conditions?: DsCondition[];
  }

  export interface DsColUpdate {
    id: string;
    dsColId: string;
    value?: string;
  }

  export interface DsColSort {
    id: string;
    dsColId: string;
    sort: "asc" | "desc" | string;
  }

  // 数据源节点
  export interface DsAddNode extends DsBasicNode {
    colsUpdate: DsColUpdate[];
  }
  export interface DsUpdateNode extends DsBasicNode {
    colsUpdate: DsColUpdate[];
  }
  export interface DsRemoveNode extends DsBasicNode {}
  export interface DsQueryCol {
    id: string;
    dsColId: string;
  }
  export interface DsQueryNode extends DsBasicNode {
    // 查询上线
    limit: number;
    // 排序方式
    sorts: DsColSort[];
    // 查询字段
    queryCols: DsQueryCol[];
  }

  export interface LoopItem {
    id: string;
    value: string;
  }

  // 循环节点
  export interface LoopNode extends Node {
    // 循环次数 noLimit-无限 custom-自定义
    loopTimesType: "noLimit" | "custom" | string;
    // 循环次数
    loopTimes: number;
    // 自定义循环列
    customLoopItems?: LoopItem[];
    // 定时类型
    cronType: "cron" | "interval" | string;
    // 定时循环配置
    cron?: string;
    loopInterval?: number;
    loopIntervalUnit?: string;
    // 终止条件
    breakConditions?: DsCondition[];
    breakConditionsLogicOperation?: "and" | "or" | string;
    // 忽略条件
    continueConditions?: DsCondition[];
    continueConditionsLogicOperation?: "and" | "or" | string;
    // 子流程信息
    flow: Flow;
  }

  // 迭代节点
  export interface IterationNode extends Node {
    // 并行模式
    parallelMode: boolean;
    // 最大并行数
    parallelMax: number;
    // 扁平化输出
    outputFlat: boolean;
    // 子流程信息
    flow: Flow;
    // 终止条件
    breakConditions?: DsCondition[];
    breakConditionsLogicOperation?: "and" | "or" | string;
    // 忽略条件
    continueConditions?: DsCondition[];
    continueConditionsLogicOperation?: "and" | "or" | string;
  }

  export interface VarFieldSort {
    id: string;
    field: string;
    sort: "asc" | "desc" | string;
  }

  // 列表操作节点
  export interface ListVarNode extends Node {
    // 取第N项开启状态
    indexNEnable: boolean;
    // 取第N项
    indexN: number;
    // 获取前N项开启状态
    topNEnable: boolean;
    // 获取的列表前N项
    topN: number;
    // 是否排序
    sortable: boolean;
    // 排序字段
    sort: VarFieldSort[];
    // 条件关系
    conditionsLogicOperation: "and" | "or" | string;
    // 过滤条件
    conditions?: DsCondition[];
  }

  // 文本节点
  export interface TextNode extends Node {
    // 数组拼接符号
    arrJoin: "," | string;
    // 文本内容
    text?: string;
    // 字符串分割符号 默认为空，表示不分割
    textSplit?: string;
    // 是否转Json输出
    outputToJson?: boolean;
  }

  // 输入节点
  export interface InNode extends Node {}

  // 输出节点
  export interface OutNode extends Node {
    // 输出类型
    contentType: "text" | "img" | "csv" | "xls" | "file" | string;
    // 输出展示模式
    displayMode?:
      | "none"
      | "modal"
      | "drawer"
      | "message"
      | "notication"
      | string;
    // 文本内容
    textContent?: string;
    // 文件路径
    filePath?: string;
  }

  // 开始节点
  export interface StartNode extends Node {}

  // 结束节点
  export interface EndNode extends Node {}

  // 其他组件节点
  export interface WidgetNode extends Node {}

  // 消息发送节点
  export interface MsgSendNode extends Node {
    // 消息类型 global-全局广播  code-频段广播
    msgType: "code" | string;
    // 消息频段
    msgCode?: string;
    // 发送消息的内容
    msgContent?: string;
    // 消息发送类型 varsChange-变量变更时触发 interval-定时发送
    msgSendTrigger: "varsChange" | "interval" | string;
    // 定时发送表达式
    cron?: string;
  }

  // 消息接收节点
  export interface MsgReceiveNode extends Node {
    // 监听的频段
    msgCode: string;
  }

  // 日志节点  用来打运行日志
  export interface LogNode extends Node {
    // 日志名称 名称中也可以使用变量
    logName?: string;
    // 日志内容 日志中可以使用变量，且有默认可用的变量$LOG_TIME,表示日志打印的时间
    logContent?: string;
    // 日志外放路径
    logFilePath?: string;
  }

  // Json反序列化节点
  export interface JsonToOut extends Node {}

  // Json序列化
  export interface InToJson extends Node {}

  export interface HttpReqParam {
    id: string;
    // 参数名称
    name: string;
    // 参数值
    value?: string;
  }

  export interface VarItem {
    id: string;
    name: string;
    dataType: string;
  }

  // http 请求节点
  export interface HttpNode extends Node {
    // 请求类型
    reqType: "get" | "post" | "put" | "delete" | "patch" | "head" | string;
    // 请求url
    reqUrl?: string;
    // 请求体
    reqBodyType: "none" | "json" | "rawText" | string;
    // body内容 当reqBodyType为json 或rawText可输入内容
    reqBodyContent?: string;
    // 请求时间限制 秒 默认60s
    reqTimeLimit: number;
    // 重试次数  默认3
    retryCount: number;
    // 请求参数
    reqParams?: HttpReqParam[];
    // 请求头
    reqHeader?: HttpReqParam[];
    // 是否开启鉴权
    enableAuth?: boolean;
    // 鉴权类型 brearerToken-Bearer Token  custom-自定义
    authType?: "bearerToken" | "custom" | string;
    // token值  authType为bearerToken时有效
    tokenValue?: string;
    // 鉴权加入方式
    authAddTo?: "header" | "query" | string;
    // 自定义变量key
    customAuthKey?: string;
    // 自定变量值
    customAuthValue?: string;
    // 是否启动异常忽略
    enableErrorIgnore?: boolean;
    // 异常默认输出内容
    errorOutJson?: string;
  }

  export interface VarGroup {
    // 分组id
    id: string;
    // 分组名称
    name: string;
    // 变量id
    inParamIds: string[];
  }

  // 变量聚合节点
  export interface VarGroupsNode extends Node {
    // 聚合方式 firstNotNullValue-第一个非空值 max-最大值 min-最小值
    aggregationType: "firstNotNullValue" | "max" | "min" | string;
    // 分组
    groups: VarGroup[];
  }

  // 延时节点
  export interface WaitNode extends Node {
    // 等待类型 fixed-固定时间（默认值） random-随机时间
    waitType: "fixed" | "random";
    // 延时时间
    time: number;
    // 随机等待时间范围
    randomTimeRange: number[];
    // 时间单位
    timeUnit: "ms" | "s" | "m" | "h" | "d" | string;
  }

  // 工作流节点
  export interface FlowNode extends Node {
    // 仪表id
    boardId: string;
    // 块id
    blockId: string;
    // 流程信息
    flow: Flow;
    // 是否启动异常忽略
    enableErrorIgnore?: boolean;
    // 异常默认输出内容
    errorOutJson?: string;
  }

  // 表达式变量
  export interface ExpressionVar extends InParam {
    // var-变量值 equation-方程式结果
    valueType: "var" | "equation" | string;
    // 索引名称
    indexName: string;
  }

  // 表达式方程
  export interface ExpressionEquation {
    id: string;
    // 方程名称名称
    name: string;
    value?: string;
  }

  // 表达式计算节点
  export interface ExpressionNode extends Node {
    // 表达式变量
    expressionVars: ExpressionVar[];
    // 表达式方程
    equations: ExpressionEquation[];
  }

  // 退出循环节点
  export interface EndLoop extends Node {}

  // flow操作符号
  export interface FlowVarDataType {
    // 数据类型
    type: string;
    // 数据名称
    name: string;
    // 简短名称
    shortName: string;
  }

  export interface Flow {
    // 流程id
    id: string;
    // 父流程id
    parentId?: string;
    // card-卡片模式  simple-简化模式 inherit-继承父flow类型
    mode: "card" | "simple" | "inherit" | string;
    // 布局模式  horizontal-水平 vertical-垂直 auto-自动  inherit-继承父flow布局
    orient: string;
    nodes: Node[];
    lines: Line[];
    // 缩放类型 auto-自适应  custom-自定义缩放值 inherit-继承父flow缩放
    zoomType: "atuo" | "custom" | string;
    // 缩放值 当zoomType为inherit时，zoom取父zoom值
    zoom: number;
    // 流程版本
    version: string;
    // 流程描述
    description?: string;
    // 变量上下文标识  alarm-告警流程（由 fat-monitor 触发行为/Agent 标记，
    // 变量值选择面板会额外提供“告警变量”分类）
    varContext?: string;
    // 流程角色标识  agent-Agent 流程（由 fat-monitor Agent 标记）。
    // 当 flowRole === "agent" 时：
    // - end 节点固定输出 result (number) 变量，不可修改
    // - EndExecutor 确保输出包含 result 字段
    flowRole?: string;
  }

  // etl 流程图
  export interface ETLFlow extends Flow {}

  // 屏幕区域
  export interface ScRegion {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }

  // 屏幕找图节点
  export interface ScFindImgNode extends Node {
    // 图片引用key（截图/上传后生成）。与 imagePath 互斥：有 imagePath 时需清空它
    imageRefKey?: string;
    // 图片路径（手动输入/变量）。与 imageRefKey 互斥：有 imageRefKey 时需清空它
    imagePath?: string;
    // 查找区域  默认获取当前屏幕全屏区域
    region: ScRegion;
    // 相似度 0-1  默认0.6
    similarity: number;
    // 查找此时 repeat-重复识别指定次数(默认值) loop-循环识别，直到找到为止
    findType: "repeat" | "loop" | string;
    // 识别次数 默认1次
    repeatCount: number;
    //查找时间间隔(ms) 默认200ms
    interval: number;
    // 查找超时时间(s)  默认60s在findType为loop时设置
    timeout: number;
    // 找到后执行动作 none-无(默认值) click-点击 move-移动
    mouseAction:
      | "none"
      | "click"
      | "doubleClick"
      | "rightClick"
      | "rightDoubleClick"
      | "middleClick"
      | "middleDoubleClick"
      | "move"
      | string;
    // 鼠标移动到图片的位置
    mousePosInRegion:
      | "center"
      | "topLeft"
      | "topRight"
      | "bottomLeft"
      | "bottomRight"
      | string;
    // 点击/移动 偏移量
    offsetX?: number;
    offsetY?: number;
  }

  // 屏幕找色节点
  export interface ScFindColorNode extends Node {
    // 颜色值 #RRGGBB
    color: string;
    // 偏色/相似度 默认0.9
    similarity: number;
    // 查找区域
    region: ScRegion;
    // 查找方向
    // 0: leftTopToRightBottom - 从左上到右下
    // 1: rightTopToLeftBottom - 从右上到左下
    // 2: leftBottomToRightTop - 从左下到右上
    // 3: rightBottomToLeftTop - 从右下到左上
    // 4: centerToOut - 从中心往四周
    // 5: outToCenter - 从四周往中心
    direction?:
      | "leftTopToRightBottom"
      | "rightTopToLeftBottom"
      | "leftBottomToRightTop"
      | "rightBottomToLeftTop"
      | "centerToOut"
      | "outToCenter"
      | number;
    // 多点找色配置 "x|y|color,..."
    multiColors?: string;
    // 查找此时 repeat-重复识别指定次数(默认值) loop-循环识别，直到找到为止
    findType: "repeat" | "loop" | string;
    // 识别次数 默认1次
    repeatCount: number;
    //查找时间间隔(ms) 默认200ms
    interval: number;
    // 查找超时时间(s)  默认60s在findType为loop时设置
    timeout: number;
  }

  // 文字识别节点
  export interface ScFindTextNode extends Node {
    // 待查找文本
    text: string;
    // 查找区域
    region?: ScRegion;
    // 语言库
    lang?: "cn" | "en" | string;
    // 文字匹配度 0-1  默认0.9
    similarity: number;
    // 查找此时 repeat-重复识别指定次数(默认值) loop-循环识别，直到找到为止
    findType: "repeat" | "loop" | string;
    // 识别次数 默认1次
    repeatCount: number;
    //查找时间间隔(ms) 默认200ms
    interval: number;
    // 查找超时时间(s)  默认60s在findType为loop时设置
    timeout: number;
    // 找到后执行动作 none-无(默认值) click-点击 move-移动
    mouseAction:
      | "none"
      | "click"
      | "doubleClick"
      | "rightClick"
      | "rightDoubleClick"
      | "middleClick"
      | "middleDoubleClick"
      | "move"
      | string;
    // 鼠标移动到图片的位置
    mousePosInRegion:
      | "center"
      | "topLeft"
      | "topRight"
      | "bottomLeft"
      | "bottomRight"
      | string;
  }

  // 鼠标点击
  export interface ScMouseClickNode extends Node {
    // 鼠标按键 left right middle
    button: "left" | "right" | "middle" | string;
    // 点击类型 click doubleClick down up
    clickType: "click" | "doubleClick" | "down" | "up" | string;
    // 坐标来源 current-当前位置 custom-自定义
    posType: "current" | "custom" | string;
    // 同时点击多个按键
    modifiers?: string[];
    // 自定义坐标 可以输入变量引用
    x?: string;
    y?: string;
  }

  // 鼠标移动
  export interface ScMouseMoveNode extends Node {
    // 移动方式 instant-瞬间 smooth-平滑
    moveType: "instant" | "smooth" | string;
    // 目标X 可引用变量
    x: string;
    // 目标Y 可引用变量
    y: string;
    // 移动耗时(ms) smooth模式下有效
    duration?: number;
    // 添加坐标随机抖动
    addOffset: boolean;
    // x随机 可引用变量
    xOffset: string;
    // y随机 可引用变量
    yOffset: string;
  }

  // 键盘点击
  export interface ScKeyboardClickNode extends Node {
    // 按键键码/名称
    key: string;
    // 键盘动作 click-点击(按下+松开) press-按下 release-松开
    action: "click" | "press" | "release" | string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 按下时长(ms)
    duration?: number;
    // 重复次数
    repeatCount?: number;
  }

  // 文本输入
  export interface ScInputNode extends Node {
    // 输入文本
    text: string;
    // 输入间隔(ms)
    interval?: number;
    // 是否使用剪贴板输入 (paste)
    pasteMode?: boolean;
    // 重复次数
    repeatCount?: number;
  }

  // 鼠标滚轮
  export interface ScScrollNode extends Node {
    // 滚动行为 instant-瞬间 smooth-平滑
    scrollType: "instant" | "smooth" | string;
    // 滚动耗时(ms) smooth模式下有效
    duration?: number;
    // 滚动轴向 vertical-垂直 horizontal-水平
    orientation: "vertical" | "horizontal" | string;
    // 滚动方向 up down
    direction: "up" | "down" | "left" | "right" | string;
    // 滚动步长
    amount: number;
  }

  // 截屏节点
  export interface ScScreenshotNode extends Node {
    // 截屏方式 full-全屏 window-窗口 custom-自定义
    screenshotType: "full" | "window" | "custom" | string;
    // 截屏保存路径
    savePath?: string;
    // 截取区域
    region?: ScRegion;
    // 是否保存到剪贴板
    saveToClipboard?: boolean;
  }

  // 启动关闭程序
  export interface ScLaunchCloseExeNode extends Node {
    // 启动方式 start-启动程序 close-关闭程序
    runType: "start" | "close" | string;
    // 程序路径
    exePath: string;
    // 启动参数
    args?: string[];
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 打开文件节点
  export interface ScOpenFileNode extends Node {
    // 文件路径
    filePath: string;
    // 打开方式
    openType: "default" | "custom" | string;
    // 自定义打开方式
    customOpenType?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 计算机操作节点
  export interface ScComputerNode extends Node {
    // 计算机操作
    computerAction: "shutdown" | "restart" | "logoff" | "sleep" | string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  export interface ComputerMetricFilter {
    id: string;
    // 过滤键 value-当前指标值  processName-进程名称 processId-进程ID
    key: string;
    // 操作符
    operator:
      | "equal"
      | "notEqual"
      | "contains"
      | "notContains"
      | "greaterThan"
      | "lessThan"
      | "greaterOrEqual"
      | "lessOrEqual"
      | string;
    // 过滤值 可以引用变量
    value: string[];
  }

  export interface ComputerMetric {
    id: string;
    // 指标ID
    metricId: "cpuUsage" | "memoryUsage" | "diskUsage" | "networkUsage";
    // avg平均值 max最大值 min最小值 sum总和 last最新值
    aggregate: "avg" | "max" | "min" | "sum" | "last" | string;
    // 过滤条件逻辑 and-且 or-或 默认and
    filterLogic: "and" | "or" | string;
    // 过滤条件
    filters?: ComputerMetricFilter[];
  }

  // 分组
  export interface ComputerMetricGroup {
    id: string;
    // 分组key  例如：processName processId
    groupKey: string;
  }

  // 性能指标节点
  export interface ComputerPerformanceNode extends Node {
    // relativeTime 相对时间 最近N个时间点
    relativeTime?: number;
    // 相对时间单位 ms-毫秒 s-秒 m-分钟 h-小时 d-天
    relativeTimeUnit?: string;
    // 性能指标
    metrics: ComputerMetric[];
    // 分组
    groups: ComputerMetricGroup[];
  }

  // 写入剪切板节点
  export interface ScWriteToClipboardNode extends Node {
    // 写入类型 text-文本 file-文件
    writeType: "text" | "file" | string;
    // 写入文本
    text?: string;
    // 写入文件路径
    filePath?: string;
  }

  // 音频播放节点
  export interface PlayAudioNode extends Node {
    // 音频路径 可引用变量
    audioPath?: string;
    // 音量 0-100 默认50
    volume: number;
    // 播放速度 1-正常 0.5-半速 2-双倍速 默认1
    playSpeed: number;
    // 循环次数 默认1次 可选可输入
    loopCount: number;
  }

  // 点
  export interface ScPoint {
    x: number;
    y: number;
  }

  // 视频播放节点
  export interface PlayVideoNode extends Node {
    // 视频路径 可引用变量
    videoPath?: string;
    // 屏幕类型 full-全屏 window-窗口 custom-自定义
    screenType: "full" | "window" | "custom" | string;
    // 视频位置 窗口模式下有效
    windowPosition?: ScPoint;
    // 截取区域
    region?: ScRegion;
    // 音量 0-100 默认50
    volume: number;
    // 播放速度 1-正常 0.5-半速 2-双倍速 默认1
    playSpeed: number;
    // 隐藏播放器头部 默认false
    hideHeader: boolean;
    // 播放后自动关闭视频 默认true
    autoClose: boolean;
    // 静音 默认false
    isMute?: boolean;
    // 播放器窗口透明度 0-100 默认100
    windowOpacity: number;
    // 循环次数 默认1次 可选可输入
    loopCount: number;
  }

  // 音频转码节点
  export interface AudioTranscodeNode extends Node {
    // 音频路径 可引用变量
    audioPath?: string;
    // 输出音频路径 可引用变量
    outputAudioPath?: string;
    // 输出音频格式：支持任意 ffmpeg 可用的输出 format/muxer 名称（默认 mp3）
    outputAudioFormat?: string;
    // 音量 0-100 默认采用源音量
    volume?: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 视频转码节点
  export interface VideoTranscodeNode extends Node {
    // 视频路径 可引用变量
    videoPath?: string;
    // 输出视频路径 可引用变量
    outputVideoPath?: string;
    // 输出视频格式：支持任意 ffmpeg 可用的输出 format/muxer 名称（默认 mp4）
    outputVideoFormat?: string;
    // 音量 0-100 默认采用源音量
    volume?: number;
    // 帧采样率 默认采用源采样率
    frameRate?: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 图片转码节点
  export interface ImageTranscodeNode extends Node {
    // 图片路径 可引用变量
    imagePath?: string;
    // 输出图片路径 可引用变量
    outputImagePath?: string;
    // 输出图片格式：支持任意 ffmpeg 可用的输出 format/muxer 名称（默认 jpg）
    outputImageFormat?: string;
    // 【统一的画质/压缩控制】
    // 1. 有损格式（jpg/webp）：0-100（数值越高画质越好）
    // 2. 无损格式（png）：0-9（数值越高压缩越狠，体积越小）
    // 默认：采用源文件的质量/压缩级别
    qualityOrCompression?: number;
    // 输出宽 默认使用源宽
    width?: number;
    // 输出高 默认使用源高
    height?: number;
    // 缩放模式（默认 cover）
    // cover-裁剪填满 | contain-等比缩放（留黑边） | scale-强制拉伸
    resizeMode?: "cover" | "contain" | "scale";
    // 色彩与透明配置
    // 背景色（仅透明格式转非透明格式时生效，如 png 转 jpg）
    background?: string;
    // 颜色模式（默认 rgb），决定是否保留透明通道
    colorMode?: "rgb" | "rgba" | "grayscale";
    // 是否开启格式专属优化（默认 false）
    // JPG：开启 progressive 渐进式 | PNG：开启最高级压缩 | WebP：开启无损/有损优化
    optimize?: boolean;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 读取剪切板节点
  export interface ScReadFromClipboardNode extends Node {
    // 读取类型 text-文本 file-文件
    readType: "text" | "file" | string;
    // 读取文本
    text?: string;
    // 读取文件路径
    filePath?: string;
  }

  // 打开网页节点
  export interface ScBrowserOpenWebPageNode extends Node {
    // 网页URL
    url: string;
    // 打开方式 default-默认浏览器 custom-自定义浏览器
    openType: "default" | "custom" | string;
    // 自定义浏览器
    customBrowser?: string;
    // 自定义打开方式 headless-无头浏览器 normal-普通浏览器
    customOpenType?: string;
    // 等待条件 等待网页加载完成(默认) ,DOM加载完成 ,自定义时间(ms)
    waitType: "loadComplete" | "domComplete" | "custom";
    // 等待时间(s) custom模式下有效
    waitTime?: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 关闭网页节点
  export interface ScBrowserCloseWebPageNode extends Node {
    // 关闭方式 all-关闭所有网页 custom-自定义关闭
    closeType: "all" | "custom" | string;
    // 作用的浏览器 default-默认浏览器 chrome-关闭chrome浏览器...  all-所有浏览器
    browser?: string;
    // 自定义关闭方式 urlMatch-关闭指定URL titleMatch-关闭指定标题 autoMatch-自动匹配 all-关闭所有页签
    customCloseType?: string;
    // 是否精确匹配
    isExactMatch: boolean;
    // 匹配值 可使用变量
    matchValue?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 刷新网页节点
  export interface ScBrowserRefreshWebPageNode extends Node {
    // 刷新方式 default-默认刷新 custom-自定义刷新
    refreshType: "default" | "custom" | string;
    // 自定义刷新方式
    // hard: 强制刷新(忽略缓存)
    // url: 重新访问当前URL
    // js: 执行location.reload()
    customRefreshType?: "hard" | "url" | "js" | string;
    // 作用的浏览器 default-默认浏览器 chrome-关闭chrome浏览器...  all-所有浏览器
    browser?: string;
    // 自定义关闭方式 urlMatch-关闭指定URL titleMatch-关闭指定标题 autoMatch-自动匹配 all-关闭所有页签
    matchType?: string;
    // 是否精确匹配
    isExactMatch: boolean;
    // 匹配值 可使用变量
    matchValue?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }
  // 点击网页元素节点
  export interface ScBrowserClickWebElementNode extends Node {
    // 元素选择器
    selector: string;
    // 点击方式 click-点击(按下+松开) dbclick-双击 press-按下 release-松开
    action: "click" | "doubleClick" | "press" | "release" | string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 按下时长(ms)
    duration?: number;
    // 点击次数 默认1次
    clickCount: number;
    // 点击间隔(ms) 默认0ms
    interval: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 悬停网页元素节点
  export interface ScBrowserHoverWebElementNode extends Node {
    // 元素选择器
    selector: string;
    // 悬停方式 hover-悬停(按下+松开)
    action: "hover" | string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 悬停时长(ms)
    duration?: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 网页输入文本节点
  export interface ScBrowserInputTextNode extends Node {
    // 元素选择器
    selector: string;
    // 输入文本
    text: string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 网页下拉选择节点
  export interface ScBrowserSelectWebElementNode extends Node {
    // 元素选择器
    selector: string;
    // 选中方式 按值 按文本 按索引
    selectType: "value" | "visibleText" | "index" | string;
    // 下拉选择值
    value: string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 网页勾选元素节点
  export interface ScBrowserCheckWebElementNode extends Node {
    // 元素选择器
    selector: string;
    // 勾选方式 check-勾选(选中) uncheck-取消勾选(取消选中)
    action: "check" | "uncheck" | string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 网页拖拽元素节点
  export interface ScBrowserDragWebElementNode extends Node {
    // 元素选择器
    selector: string;
    // 目标元素选择器
    targetSelector: string;
    // 拖拽方式 drag-拖拽(按下+松开)
    action: "drag" | string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 拖拽时长(ms)
    duration?: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 网页滚动元素节点
  export interface ScBrowserScrollWebElementNode extends Node {
    // 元素选择器
    selector: string;
    // 滚动方式 mouseScroll-鼠标滚动(按下+松开)
    actionType: "mouseScroll" | string;
    // 滚动轴向 vertical-垂直 horizontal-水平
    orientation: "vertical" | "horizontal" | string;
    // 滚动方向 up down
    direction: "up" | "down" | "left" | "right" | string;
    // 组合键 ["Ctrl", "Shift"]
    modifiers?: string[];
    // 滚动时长(ms)
    duration?: number;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 获取网页元素数据节点
  export interface ScBrowserGetWebElementDataNode extends Node {
    // 元素选择器
    selector: string;
    // 获取数据方式 text-文本内容 html-HTML内容 attributes-属性值
    dataType: "text" | "html" | "attributes" | "url" | string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 下载文件节点
  export interface ScBrowserDownloadFileNode extends Node {
    // 下载类型 trigger-触发下载 url-链接下载
    downloadType: "trigger" | "url" | string;
    // 触发下载的元素选择器 downloadType为trigger时必填
    triggerSelector?: string;
    // 文件URL downloadType为url时必填
    fileUrl?: string;
    // 下载路径
    downloadPath: string;
    // 文件名
    fileName?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 上传文件节点
  export interface ScBrowserUploadFileNode extends Node {
    // 上传类型 trigger-触发上传 url-链接上传
    uploadType: "trigger" | "url" | string;
    // 触发上传的元素选择器 uploadType为trigger时必填
    triggerSelector?: string;
    // 文件URL uploadType为url时必填
    fileUrl?: string;
    // 上传请求类型
    requestType: "POST" | "PUT" | string;
    // 上传参数 uploadType为url时选填
    uploadParams?: Record<string, string> | [string, string][];
    // 上传路径
    uploadPath: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 屏幕任务流程图
  export interface ScreenTaskFlow extends Flow {}

  // 大模型技能
  export interface AgentSkill {
    id: string;
    // 技能类型  flow-流程技能 knowledgeBase-知识库技能 tool-工具技能 code-代码技能
    type: "flow" | "knowledgeBase" | "tool" | "code" | string;
    // 技能对象id
    objId: string;
  }

  // 控制台运行节点 用于执行控制台命令
  export interface ConsoleRunNode extends Node {
    // 控制台命令 可引用变量（支持 ${nodeId.paramId} 形式）
    command: string;
  }

  // 大语言模型节点
  export interface LLMNode extends Node {
    // 模型ID
    modelId: string;
    // 上下文 可引用变量
    contextText?: string;
    // 视觉理解输入 可引用变量
    imgVars?: string[];
    // 系统提示词 可引用变量
    sysPrompt?: string;
    // 用户提示词 可引用变量
    userPrompt?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // Agent节点 用于执行大模型技能
  export interface AgentNode extends Node {
    // 策略id
    agentId: string;
    // 模型ID
    modelId: string;
    // 上下文 可引用变量
    contextText?: string;
    // 技能列表
    skills: AgentSkill[];
    // 指令 可引用变量
    instruction?: string;
    // 查询文本 可引用变量
    queryText?: string;
    // 最大迭代次数 默认10次
    maxIterations: number;
  }

  // 知识检索节点
  export interface KnowledgeRetrievalNode extends Node {
    // 知识库ID
    knowledgeBaseIds: string[];
    // 查询文本 可引用变量
    queryText?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 问题分类条件
  export interface QuestionClassificationCondition {
    id: string;
    // 分类名称
    name: string;
    // 条件文本 可引用变量
    conditionText?: string;
  }

  // 问题分类节点
  export interface QuestionClassificationNode extends Node {
    // 问题分类模型ID
    modelId: string;
    // 问题文本 可引用变量
    questionText?: string;
    // 问题分类条件列表
    conditions: QuestionClassificationCondition[];
    // 指令 可引用变量
    instruction?: string;
    // 执行完毕后等待毫秒数 默认0ms
    delayAfterAction?: number;
  }

  // 记忆写入节点
  export interface MemoryWriteNode extends Node {
    // 写入信息 可引用变量
    writeText?: string;
    // 记忆库id
    memoryId: string;
  }

  export interface MemoryQueryText {
    id: string;
    // 可引用变量
    value: string;
  }

  // 记忆查询节点
  export interface MemoryReadNode extends Node {
    // 查询文本
    queryTexts: MemoryQueryText[];
    // 匹配度阈值 默认0.5
    matchThreshold: number;
    // 记忆库id
    memoryId: string;
    // 查询条数 默认10条
    topK: number;
  }

  // 文档提取器节点 将用户上传的文档解析为LLM 便于理解的文本内容
  export interface DocumentExtractorNode extends Node {
    // 文档路径 可引用变量
    documentPath?: string;
    // ocrId 用于指定ocr服务 没填则指定默认ocr 如果文档是图片类型，就使用ocr提取图片中的内容
    ocrId?: string;
    // 最大字符数 默认5000
    maxChars: number;
  }

  // 文字转语音节点
  export interface TTSNode extends Node {
    // ttsId
    ttsId: string;
    // 文本内容 可引用变量
    text?: string;
    // 自定义参数
    params?: object;
    // 是否自动播放 （生成成功后）
    autoPlay?: boolean;
    // 音频输出文件夹路径 可引用变量 不填时采用默认路径
    audioPath?: string;
    // 音频文件名 可引用变量 不填时采用默认文件名 "aduio"
    audioName?: string;
    // 音频文件类型 默认wav 如果实际生成的文件格式和设置的对不上，就将实际格式作为文件类型，更新这个字段
    audioFileType?: string;
  }

  export interface ASRNode extends Node {
    asrId?: string;
    audioOSSPath?: string;
    params?: any;
    delayAfterAction?: number;
  }

  // 思维流程图
  export interface ThinkFlow extends Flow {}

  // 静态节点
  // 注释
  export interface AnnotationNode extends Node {
    // 注释文本 可使用系统变量
    text?: string;
    // 字体大小
    fontSize?: number;
    // 是否加粗
    bold?: boolean;
    // 是否为斜体
    italic?: boolean;
    // 文本颜色
    fontColor?: string;
    // 水平对齐方式
    hAlign?: "left" | "center" | "right";
    // 垂直对齐方式
    vAlign?: "top" | "middle" | "bottom";
    // 自动换行
    autoNewline?: boolean;
    // 背景颜色
    bgColor?: string;
    // 背景透明度 0-100
    bgOpacity?: number;
  }

  // 文本
  export interface TextNode extends Node {
    // 文本内容 可使用系统变量
    text?: string;
    // 字体
    fontSize?: number;
    // 是否加粗
    bold?: boolean;
    // 是否为斜体
    italic?: boolean;
    // 文本颜色
    fontColor?: string;
    // 水平对齐方式
    hAlign?: "left" | "center" | "right";
    // 垂直对齐方式
    vAlign?: "top" | "middle" | "bottom";
    // 自动换行
    autoNewline?: boolean;
    // 文本高亮配置
    textHighLight?: UI.HighLightText[];
    // 内边距
    padding?: FramePadding;
    // 开启边框阴影
    showShadow?: boolean;
    // 阴影
    shadow?: string;
    // 圆角
    radius?: FrameBorderRadius;
    // 边宽
    border?: FrameBorder[];
    // 卡片背景颜色
    bgColor?: string;
  }

  // 富文本
  export interface RichTextNode extends Node {
    // 富文本内容 (slate Descendant[] 序列化后的 JSON 字符串) 可使用系统变量
    text?: string;
    // 富文本内容 (slate Descendant[] 原始结构)
    content?: unknown[];
    // 卡片背景颜色
    bgColor?: string;
    // 内边距
    padding?: FramePadding;
    // 开启边框阴影
    showShadow?: boolean;
    // 阴影
    shadow?: string;
    // 圆角
    radius?: FrameBorderRadius;
    // 边宽
    border?: FrameBorder[];
  }

  // 背景板
  export interface BackdropNode extends Node {
    // 卡片背景颜色
    bgColor?: string;
    // 背景透明度 0-100
    bgOpacity?: number;
    // 内边距
    padding?: FramePadding;
    // 开启边框阴影
    showShadow?: boolean;
    // 阴影
    shadow?: string;
    // 圆角
    radius?: FrameBorderRadius;
    // 边宽
    border?: FrameBorder[];
    // 背景图片
    bgImage?: string;
  }

  // 画板 可用来画画，暂时不加
  export interface DrawingBoardNode extends Node {
    // 画的图片
    drawImage?: string;
    // 卡片背景颜色
    bgColor?: string;
    // 内边距
    padding?: FramePadding;
    // 开启边框阴影
    showShadow?: boolean;
    // 阴影
    shadow?: string;
    // 圆角
    radius?: FrameBorderRadius;
    // 边宽
    border?: FrameBorder[];
  }
}
