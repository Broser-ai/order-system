export interface Master {
  id: string;
  name: string;
  affiliation: string;
  authority: string;
  default_gateway: string;
}

export interface GatewayConfig {
  defaultModel: string;
  masterGateways: Record<string, string>;
}

export interface Components {
  outputTypes: string[];
}

export interface PatternResult {
  masterId: string;
  masterName: string;
  model: string;
  content: string;
  tokens: number;
  costUsd: number;
  status: "success" | "error";
  error?: string;
}
