/*
 * 宿主 AI 数据模型镜像（源：fat-notes-core src/frontend/models/ai.d.ts 的
 * AI.KnowledgeBase 系列 + reducers/settings/aiSlice 的 ModelItem /
 * KnowledgeBaseItem）。纯类型文件，无运行时代码。
 */
declare namespace AI {
  // 可见性：单机单用户模式下通常为 local，仅用于未来扩展
  export type KnowledgeBaseVisibility = "local" | string;

  // 状态：ready-可用；indexing-索引中；disabled-禁用；error-异常
  export type KnowledgeBaseStatus =
    | "ready"
    | "indexing"
    | "disabled"
    | "error"
    | string;

  // 存储配置：知识库仅使用向量数据库进行存储与检索
  export interface KnowledgeBaseStorage {
    // 存储类型：固定为 vector
    type: "vector";
    // 存储路径/根目录（部分本地向量库会用到，如本地持久化目录）
    path?: string;
    // 向量索引名称/集合名
    indexName: string;
    // 命名空间/分区（向量库常用）
    namespace?: string;
    // 自定义参数（透传给具体实现）
    customParams?: object;
  }

  // 向量化配置：描述 embedding 的模型与行为
  export interface KnowledgeBaseEmbedding {
    // embedding 模型ID（通常对应 AI.Model.id）
    modelId: string;
    // 向量维度（可选，部分后端需要显式声明）
    dims?: number;
    // 是否归一化向量（可选）
    normalize?: boolean;
    // 批量向量化大小（可选）
    batchSize?: number;
    // 自定义参数（透传给具体实现）
    customParams?: object;
  }

  // 切分配置：将文档切分为可检索的 chunk
  export interface KnowledgeBaseChunking {
    // 切分策略：recursive/markdown/token 等
    strategy?: "recursive" | "markdown" | "token" | string;
    // chunk 大小（按策略含义可能为字符/Token）
    chunkSize?: number;
    // chunk 重叠（按策略含义可能为字符/Token）
    chunkOverlap?: number;
    // 分隔符（文本切分常用）
    separators?: string[];
    // 自定义参数（透传给具体实现）
    customParams?: object;
  }

  // 检索配置：决定如何从知识库召回内容
  export interface KnowledgeBaseRetrieval {
    // 召回数量
    topK?: number;
    // 相似度阈值（低于阈值的召回可丢弃）
    scoreThreshold?: number;
    // 是否启用重排
    useRerank?: boolean;
    // 重排模型ID（可选）
    rerankModelId?: string;
    // Query Rewrite 模型ID（可选）
    queryRewriteModelId?: string;
    // 自定义参数（透传给具体实现）
    customParams?: object;
  }

  // 统计信息：用于展示/监控
  export interface KnowledgeBaseStats {
    // 文档数量
    documentCount?: number;
    // chunk 数量
    chunkCount?: number;
    // 占用空间（字节）
    sizeBytes?: number;
    // 最近一次完成索引时间（ISO字符串）
    lastIndexedAt?: string;
  }

  // 知识来源：可用于管理"哪些内容进入该知识库"
  export interface KnowledgeBaseSource {
    // 来源id
    id: string;
    // 来源类型：file/url/note/db 等
    type: "file" | "url" | "note" | "db" | string;
    // 来源名称（展示用）
    name?: string;
    // 来源地址：文件路径/URL/资源URI
    uri?: string;
    // MIME类型（可选）
    mimeType?: string;
    // 内容哈希/指纹（用于去重/增量索引）
    hash?: string;
    // 来源状态：pending/ready/failed 等
    status?: "pending" | "ready" | "failed" | string;
    // 创建时间（ISO字符串）
    createdAt?: string;
    // 更新时间（ISO字符串）
    updatedAt?: string;
    // 额外信息（透传）
    extra?: object;
  }

  // 知识库
  export interface KnowledgeBase {
    // 知识库id
    id: string;
    // 知识库名称
    name: string;
    // 知识库描述
    description?: string;
    // 知识库图标（base64等）
    icon?: string;
    // 标签
    tags?: string[];
    // 语言（如 zh_CN/en_US）
    langs?: string[];
    // 单机单用户模式下通常为 local，仅用于未来扩展
    visibility?: KnowledgeBaseVisibility;
    // 知识库状态
    status?: KnowledgeBaseStatus;
    // 创建时间（ISO字符串）
    createdAt?: string;
    // 更新时间（ISO字符串）
    updatedAt?: string;
    // 存储与索引配置（向量数据库必填）
    storage: KnowledgeBaseStorage;
    // embedding 配置（向量数据库必填）
    embedding: KnowledgeBaseEmbedding;
    // 文档切分配置
    chunking?: KnowledgeBaseChunking;
    // 检索配置
    retrieval?: KnowledgeBaseRetrieval;
    // 统计信息
    stats?: KnowledgeBaseStats;
    // 来源列表（可选，单机模式可不维护）
    sources?: KnowledgeBaseSource[];
  }
}

export type KnowledgeBaseItem = AI.KnowledgeBase;

// OCR 配置项（源：aiSlice.OcrItem）
export interface OcrItem {
  id: string;
  name: string;
  langs?: string[];
  enabled?: boolean;
  isDefault?: boolean;
  requiredPythonPackages?: string[];
  installCommand?: string;
}

// 模型 API 类型（源：aiSlice.ApiType）
export type ApiType = "Chat" | "DoubaoResponse" | string;

// 模型配置项（源：aiSlice.ModelItem）
export interface ModelItem {
  id: string;
  name: string;
  apiKey: string;
  url: string;
  model?: string;
  supportImages?: boolean;
  isDefault?: boolean;
  customParams?: Record<string, unknown>;
  apiType?: ApiType;
}
