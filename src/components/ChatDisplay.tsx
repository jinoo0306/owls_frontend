import { Brain, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { api } from "../api";
import { AIConversation, Customer } from "../types";

interface ChatDisplayProps {
  conversation: AIConversation;
  customer: Customer;
  onStatusChange?: (conversationId: string, newStatus: string) => void;
  onConversationUpdate?: (updatedConversation: AIConversation) => void;
}

export default function ChatDisplay({
  conversation,
  customer,
  onStatusChange,
  onConversationUpdate,
}: ChatDisplayProps) {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // 디버깅을 위한 로그
  console.log("ChatDisplay - conversation.analysis:", conversation.analysis);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ai_completed":
        return "AI 완료";
      case "agent_in_progress":
        return "진행중";
      case "agent_completed":
        return "상담 완료";
      default:
        return "진행중";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ai_completed":
        return "bg-blue-100 text-blue-800";
      case "agent_in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "agent_completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const statusOptions = [
    { value: "ai_completed", label: "AI 완료" },
    { value: "agent_in_progress", label: "진행중" },
    { value: "agent_completed", label: "상담 완료" },
  ];

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(conversation.id, newStatus);
    }
    setStatusDropdownOpen(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      const updatedConversation =
        await api.conversations.addMessageToConversation(
          conversation.id,
          newMessage.trim()
        );

      if (onConversationUpdate) {
        onConversationUpdate(updatedConversation);
      }

      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      // 에러 처리 (토스트 메시지 등)
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* 대화 헤더 */}
      <div className="bg-white border-b border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium">
                {customer.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-gray-900 text-base">
                  {customer.name}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className={`text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1 hover:opacity-80 transition-opacity ${getStatusColor(
                      conversation.status
                    )}`}
                  >
                    <span>{getStatusLabel(conversation.status)}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-24">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">
                  {conversation.status === "ai_completed"
                    ? "AI 상담 완료"
                    : conversation.status === "agent_in_progress"
                    ? "상담원 진행중"
                    : "상담 완료"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 대화 내용 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl shadow-sm ${
                message.role === "user"
                  ? "bg-blue-600 text-white ml-12"
                  : "bg-white text-gray-900 mr-12"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs ${
                    message.role === "user" ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* AI 완료 시 통화 끊김 표시 */}
        {conversation.status === "ai_completed" && (
          <div className="flex justify-center py-4">
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
              통화 끊김
            </div>
          </div>
        )}
      </div>

      {/* AI 분석 결과 - 고정 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-blue-900">AI 분석 결과</h3>
        </div>

        <div className="space-y-3 mb-4">
          {/* 요청 사항 */}
          <div className="bg-white bg-opacity-70 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h4 className="font-medium text-blue-900 text-sm">요청 사항</h4>
              {conversation.analysis.priority && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    conversation.analysis.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : conversation.analysis.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {conversation.analysis.priority === "high"
                    ? "긴급"
                    : conversation.analysis.priority === "medium"
                    ? "보통"
                    : "낮음"}
                </span>
              )}
            </div>
            <p className="text-sm text-blue-800 pl-4 font-medium">
              {conversation.analysis.requestType}
            </p>
            {conversation.analysis.category && (
              <p className="text-xs text-blue-600 pl-4 mt-1">
                카테고리: {conversation.analysis.category}
              </p>
            )}
          </div>

          {/* 문의 내용 */}
          <div className="bg-white bg-opacity-70 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <h4 className="font-medium text-yellow-900 text-sm">문의 내용</h4>
              {conversation.analysis.sentiment && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    conversation.analysis.sentiment === "positive"
                      ? "bg-green-100 text-green-800"
                      : conversation.analysis.sentiment === "negative"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {conversation.analysis.sentiment === "positive"
                    ? "긍정적"
                    : conversation.analysis.sentiment === "negative"
                    ? "부정적"
                    : "중립적"}
                </span>
              )}
            </div>
            <p className="text-sm text-yellow-800 pl-4 font-medium">
              {conversation.analysis.inquiryDetails}
            </p>
            {conversation.analysis.keywords &&
              conversation.analysis.keywords.length > 0 && (
                <div className="pl-4 mt-2">
                  <p className="text-xs text-yellow-600 mb-1">키워드:</p>
                  <div className="flex flex-wrap gap-1">
                    {conversation.analysis.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* 추천 해결방법 */}
          <div className="bg-white bg-opacity-70 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h4 className="font-medium text-green-900 text-sm">
                추천 해결방법
              </h4>
              {conversation.analysis.confidence && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  신뢰도: {Math.round(conversation.analysis.confidence * 100)}%
                </span>
              )}
            </div>
            <p className="text-sm text-green-800 pl-4 font-medium">
              {conversation.analysis.recommendedAction}
            </p>
            {conversation.analysis.estimatedResolutionTime && (
              <p className="text-xs text-green-600 pl-4 mt-1">
                예상 해결 시간: {conversation.analysis.estimatedResolutionTime}
              </p>
            )}
          </div>

          {/* 관련 이슈 */}
          {conversation.analysis.relatedIssues &&
            conversation.analysis.relatedIssues.length > 0 && (
              <div className="bg-white bg-opacity-70 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h4 className="font-medium text-purple-900 text-sm">
                    관련 이슈
                  </h4>
                </div>
                <div className="pl-4">
                  <ul className="text-sm text-purple-800 space-y-1">
                    {conversation.analysis.relatedIssues.map((issue, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
        </div>

        <div className="flex items-center space-x-3 justify-end">
          {/* <button className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-sm">
            상담원으로 연결하기
          </button> */}
          <button className="px-4 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors">
            메모 추가
          </button>
        </div>
      </div>

      {/* 메시지 입력 필드 */}
      {/* {conversation.status !== "ai_completed" && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={sendingMessage}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {sendingMessage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
