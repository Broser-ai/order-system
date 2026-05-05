import { singleBestModel } from "./single-best";
import { primaryPlusFallback } from "./primary-fallback";
import { parallelExpertMode } from "./parallel-expert";
import { debateRedTeamMode } from "./debate-red-team";
import { specialistHandoff } from "./specialist-handoff";
import { cheapBatchMode } from "./cheap-batch";
import { humanApprovalCheckpoint } from "./human-approval";
import { synthesisAfterParallel } from "./synthesis";
import type { Master, GatewayConfig, Components, PatternResult } from "./types";

export type { Master, GatewayConfig, Components, PatternResult };

export async function executePattern(
  patternId: string,
  brief: string,
  squad: Master[],
  _components: Components,
  gatewayConfig: GatewayConfig,
  phase?: "phase1" | "phase2"
): Promise<PatternResult[]> {
  switch (patternId) {
    case "single_best_model":
      return singleBestModel(brief, squad, gatewayConfig);
    case "primary_plus_fallback":
      return primaryPlusFallback(brief, squad, gatewayConfig);
    case "parallel_expert_mode":
      return parallelExpertMode(brief, squad, gatewayConfig);
    case "debate_red_team_mode":
      return debateRedTeamMode(brief, squad, gatewayConfig);
    case "specialist_handoff":
      return specialistHandoff(brief, squad, gatewayConfig);
    case "cheap_batch_mode":
      return cheapBatchMode(brief, squad, gatewayConfig);
    case "human_approval_checkpoint":
      return humanApprovalCheckpoint(brief, squad, gatewayConfig, phase ?? "phase1");
    case "synthesis_after_parallel":
      return synthesisAfterParallel(brief, squad, gatewayConfig);
    default:
      throw new Error(`Unknown pattern: ${patternId}`);
  }
}
