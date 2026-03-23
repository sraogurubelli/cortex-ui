/**
 * TypeScript types matching the cortex-ai FastAPI backend schemas.
 */

// ---- Auth ----

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInfo {
  id: string;
  email: string;
  display_name: string;
  principal_type: string;
  admin: boolean;
  blocked: boolean;
  created_at: string;
}

export interface SignupRequest {
  email: string;
  display_name: string;
  account_name?: string;
}

export interface LoginRequest {
  email: string;
}

// ---- Accounts ----

export interface AccountInfo {
  id: string;
  name: string;
  billing_email: string;
  status: string;
  subscription_tier: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface AccountList {
  accounts: AccountInfo[];
  total: number;
  limit: number;
  offset: number;
}

// ---- Organizations ----

export interface OrganizationInfo {
  id: string;
  account_id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ---- Projects ----

export interface ProjectInfo {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// ---- Chat / Conversations ----

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  stream?: boolean;
  model?: string;
  context?: Record<string, unknown>;
}

export interface MessageInfo {
  id: string;
  role: string;
  content: string;
  tool_calls?: Record<string, unknown>[];
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ChatResponse {
  conversation_id: string;
  thread_id: string;
  response: string;
  token_usage: Record<string, unknown>;
  messages: MessageInfo[];
}

export interface ConversationSummary {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: string;
}

export interface ConversationList {
  conversations: ConversationSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface ConversationDetail {
  id: string;
  project_id: string;
  title?: string;
  thread_id: string;
  messages: MessageInfo[];
  created_at: string;
  updated_at: string;
}

// ---- Documents / RAG ----

export interface DocumentInfo {
  id: string;
  project_id: string;
  filename?: string;
  content_preview: string;
  metadata: Record<string, unknown>;
  created_at?: string;
}

export interface DocumentList {
  documents: DocumentInfo[];
  total: number;
}

export interface SearchHit {
  id: string;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface SearchResponse {
  results: SearchHit[];
  query: string;
  total: number;
}

export interface IngestResponse {
  doc_id: string;
  chunks: number;
  message: string;
}

// ---- Agents ----

export interface AgentDefinition {
  uid: string;
  project_uid: string;
  name: string;
  description: string;
  system_prompt: string;
  model: string;
  tools: string[];
  skills: string[];
  middleware: Record<string, unknown>;
  max_iterations: number;
  temperature: number;
  enabled: boolean;
  created_at: string;
}

export interface CreateAgentRequest {
  name: string;
  description?: string;
  system_prompt?: string;
  model?: string;
  tools?: string[];
  skills?: string[];
  middleware?: Record<string, unknown>;
  max_iterations?: number;
  temperature?: number;
}

// ---- Skills ----

export interface SkillInfo {
  uid: string;
  name: string;
  description: string;
  skill_md_content: string;
  enabled: boolean;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export interface CreateSkillRequest {
  name: string;
  description?: string;
  skill_md_content: string;
}

// ---- Models & Providers ----

export interface ModelCapabilityInfo {
  name: string;
  provider: string;
  supports_tools: boolean;
  supports_vision: boolean;
  supports_streaming: boolean;
  supports_reasoning: boolean;
  context_window: number;
  max_output_tokens: number;
  tags: string[];
}

export interface ProviderInfo {
  uid: string;
  name: string;
  provider_type: string;
  base_url: string;
  models: string[];
  priority: number;
  enabled: boolean;
  health_status: string;
  health_latency_ms: number;
}

export interface CreateProviderRequest {
  name: string;
  provider_type: string;
  api_key: string;
  base_url?: string;
}

export interface TestModelRequest {
  model: string;
  prompt: string;
}

export interface TestModelResponse {
  success: boolean;
  response: string;
  error: string;
  latency_ms: number;
}

// ---- Traces / Observability ----

export interface TraceSpan {
  span_id: string;
  parent_span_id?: string;
  name: string;
  start_time: string;
  end_time?: string;
  duration_ms: number;
  status: string;
  attributes: Record<string, unknown>;
}

export interface TraceSummary {
  trace_id: string;
  name: string;
  start_time: string;
  duration_ms: number;
  status: string;
  total_tokens: number;
  model: string;
  span_count: number;
}

export interface TraceDetail {
  trace_id: string;
  name: string;
  start_time: string;
  duration_ms: number;
  status: string;
  total_tokens: number;
  model: string;
  spans: TraceSpan[];
}

export interface TraceStats {
  total_traces: number;
  total_tokens: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
  error_rate: number;
  model_breakdown: Record<string, number>;
}

// ---- Prompts ----

export interface PromptInfo {
  key: string;
  template: string;
  variables: string[];
  description?: string;
}

export interface RenderPromptRequest {
  variables: Record<string, string>;
}

export interface RenderPromptResponse {
  rendered: string;
}
