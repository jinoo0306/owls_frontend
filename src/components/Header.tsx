import { Agent } from "../types";
import ApiStatusIndicator from "./ApiStatusIndicator";

interface HeaderProps {
  agent: Agent;
}

export default function Header({ agent }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/image copy.png" alt="부엉이들 로고" className="h-8" />
          <div>
            <p className="text-xs text-gray-500">IVR 상담</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* API 상태 표시기 */}
          <ApiStatusIndicator />

          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                agent.status === "online"
                  ? "bg-green-500"
                  : agent.status === "busy"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {agent.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
