"use client";

interface ApprovalGateProps {
  executionId: string;
  reason: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function ApprovalGate({ reason, onApprove, onReject }: ApprovalGateProps) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🛑</span>
        <div className="flex-1">
          <h3 className="text-yellow-300 font-semibold mb-1">Approval Required</h3>
          <p className="text-gray-400 text-sm mb-4">{reason}</p>
          <div className="flex gap-3">
            <button onClick={onApprove} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              ✓ Approve
            </button>
            <button onClick={onReject} className="bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 px-4 py-2 rounded-lg text-sm font-medium transition">
              ✗ Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
