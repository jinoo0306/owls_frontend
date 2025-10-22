import React, { useState, useEffect } from 'react';
import { AIConversation } from '../types';
import { 
  fetchConversationsWithErrorHandling, 
  calculateConversationStats,
  calculateMessageStats,
  getRecentConversations,
  searchConversations,
  formatApiError
} from '../api/utils';
import { api } from '../api';

// API 사용 예제 컴포넌트
export const ApiExample: React.FC = () => {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [serverStatus, setServerStatus] = useState<{
    isOnline: boolean;
    message: string;
    version?: string;
  } | null>(null);

  // 서버 상태 확인
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await api.health.checkHealth();
        setServerStatus({
          isOnline: true,
          message: status.message,
          version: status.version,
        });
      } catch (error) {
        setServerStatus({
          isOnline: false,
          message: formatApiError(error),
        });
      }
    };

    checkStatus();
  }, []);

  // 대화 데이터 로드
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      const result = await fetchConversationsWithErrorHandling();
      
      setConversations(result.conversations);
      setError(result.error);
      setLoading(false);
    };

    loadConversations();
  }, []);

  // 검색된 대화 목록
  const filteredConversations = searchConversations(conversations, searchQuery);
  
  // 통계 계산
  const conversationStats = calculateConversationStats(conversations);
  const messageStats = calculateMessageStats(conversations);
  const recentConversations = getRecentConversations(conversations, 24);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 서버 상태 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">서버 상태</h2>
        <div className={`flex items-center space-x-2 ${serverStatus?.isOnline ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-3 h-3 rounded-full ${serverStatus?.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{serverStatus?.message}</span>
          {serverStatus?.version && (
            <span className="text-sm text-gray-500">(v{serverStatus.version})</span>
          )}
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">총 대화</h3>
          <p className="text-2xl font-bold text-blue-600">{conversationStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">AI 완료율</h3>
          <p className="text-2xl font-bold text-green-600">{conversationStats.aiCompletionRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">상담원 연결율</h3>
          <p className="text-2xl font-bold text-orange-600">{conversationStats.agentEscalationRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">평균 메시지</h3>
          <p className="text-2xl font-bold text-purple-600">{messageStats.averageMessagesPerConversation}</p>
        </div>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">대화 검색</h2>
        <input
          type="text"
          placeholder="고객 ID, 메시지 내용, 요청 타입으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-2">
          {filteredConversations.length}개의 대화가 검색되었습니다.
        </p>
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">오류 발생</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 대화 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">대화 목록</h2>
          <p className="text-sm text-gray-500">
            최근 24시간 내 대화: {recentConversations.length}개
          </p>
        </div>
        <div className="divide-y">
          {filteredConversations.map((conversation) => (
            <div key={conversation.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">
                    고객 ID: {conversation.customerId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(conversation.startTime).toLocaleString('ko-KR')}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  conversation.status === 'ai_completed' 
                    ? 'bg-green-100 text-green-800'
                    : conversation.status === 'agent_in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {conversation.status === 'ai_completed' ? 'AI 완료' :
                   conversation.status === 'agent_in_progress' ? '상담원 진행중' :
                   '상담원 완료'}
                </span>
              </div>
              
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <strong>요약:</strong> {conversation.analysis.summary}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>요청 타입:</strong> {conversation.analysis.requestType}
                </p>
              </div>
              
              <div className="text-sm text-gray-500">
                메시지 수: {conversation.messages.length}개
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiExample;

