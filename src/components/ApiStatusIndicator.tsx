import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api, ApiError } from "../api";

// API 상태 확인 컴포넌트
export const ApiStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<{
    isOnline: boolean;
    message: string;
    version?: string;
    loading: boolean;
  }>({
    isOnline: false,
    message: "",
    loading: true,
  });

  const checkStatus = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true }));
      const healthResponse = await api.health.checkHealth();
      setStatus({
        isOnline: true,
        message: healthResponse.message,
        version: healthResponse.version,
        loading: false,
      });
    } catch (error) {
      setStatus({
        isOnline: false,
        message:
          error instanceof ApiError
            ? error.message
            : "서버에 연결할 수 없습니다.",
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkStatus();
    // 30초마다 상태 확인
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border">
      {status.loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      ) : status.isOnline ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            status.isOnline ? "text-green-700" : "text-red-700"
          }`}
        >
          {status.message}
        </p>
        {status.version && (
          <p className="text-xs text-gray-500">v{status.version}</p>
        )}
      </div>

      <button
        onClick={checkStatus}
        disabled={status.loading}
        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
        title="상태 새로고침"
      >
        <RefreshCw
          className={`w-4 h-4 text-gray-600 ${
            status.loading ? "animate-spin" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default ApiStatusIndicator;

