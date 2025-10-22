import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { AIConversation, Customer } from "../types";

interface ConversationListProps {
  conversations: AIConversation[];
  customers: Customer[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function ConversationList({
  conversations,
  customers,
  selectedConversationId,
  onSelectConversation,
  loading = false,
  error = null,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getCustomerRoleLabel = (customer: Customer) => {
    // role 필드가 있으면 우선 사용
    if (customer.role) {
      return customer.role;
    }

    // role이 없으면 customerType 기반으로 추론
    switch (customer.customerType) {
      case "delivery_agency":
        return "배달대행사";
      case "rider":
        return "프리랜서 라이더";
      case "other":
        return "기타";
      default:
        return "기타";
    }
  };

  const getCustomerRoleColor = (customer: Customer) => {
    const role = getCustomerRoleLabel(customer);

    switch (role) {
      case "배달대행사":
        return "bg-blue-100 text-blue-800";
      case "소속 점주":
        return "bg-purple-100 text-purple-800";
      case "프리랜서 라이더":
        return "bg-green-100 text-green-800";
      case "기타":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const customer = customers.find((c) => c.id === conversation.customerId);
    const customerName = customer?.name || "";
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const messageContent = lastMessage?.content || "";

    // 검색어를 소문자로 변환
    const searchLower = searchTerm.toLowerCase();

    return (
      customerName.toLowerCase().includes(searchLower) ||
      messageContent.toLowerCase().includes(searchLower) ||
      conversation.analysis.requestType.toLowerCase().includes(searchLower) ||
      conversation.analysis.inquiryDetails
        .toLowerCase()
        .includes(searchLower) ||
      conversation.analysis.recommendedAction
        .toLowerCase()
        .includes(searchLower) ||
      conversation.analysis.summary.toLowerCase().includes(searchLower) ||
      (conversation.analysis.keywords &&
        conversation.analysis.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchLower)
        )) ||
      (conversation.analysis.category &&
        conversation.analysis.category.toLowerCase().includes(searchLower))
    );
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">대화목록</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="고객명 또는 대화내용 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const customer = customers.find(
              (c) => c.id === conversation.customerId
            );
            const lastMessage =
              conversation.messages[conversation.messages.length - 1];
            const isSelected = selectedConversationId === conversation.id;

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                  isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                {/* Online Status Indicator */}
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer?.name.charAt(0) || "?"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {customer?.name || "알 수 없는 고객"}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                            conversation.status
                          )}`}
                        >
                          {getStatusLabel(conversation.status)}
                        </span>
                        {/* 고객 역할 표시 */}
                        {customer && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getCustomerRoleColor(
                              customer
                            )}`}
                          >
                            {getCustomerRoleLabel(customer)}
                          </span>
                        )}
                        {/* 우선순위 표시 */}
                        {conversation.analysis.priority && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
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
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.startTime)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage?.content || "대화 없음"}
                    </p>

                    {/* 요청 사항 표시 */}
                    <p className="text-xs text-blue-600 truncate mt-1 font-medium">
                      📋 {conversation.analysis.requestType}
                    </p>

                    <div className="flex items-center mt-1 space-x-2">
                      <MessageCircle className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {conversation.messages.length}개 메시지
                      </span>
                      {/* 감정 분석 표시 */}
                      {conversation.analysis.sentiment && (
                        <span
                          className={`text-xs px-1 py-0.5 rounded ${
                            conversation.analysis.sentiment === "positive"
                              ? "bg-green-100 text-green-700"
                              : conversation.analysis.sentiment === "negative"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {conversation.analysis.sentiment === "positive"
                            ? "😊"
                            : conversation.analysis.sentiment === "negative"
                            ? "😞"
                            : "😐"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!loading && !error && filteredConversations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
