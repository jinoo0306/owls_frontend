import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { addRoleToCustomers } from "./api/utils";
import ChatDisplay from "./components/ChatDisplay";
import { ConversationList } from "./components/ConversationList";
import CustomerInfo from "./components/CustomerInfo";
import Header from "./components/Header";
import { mockAgent } from "./data/mockData";
import { AIConversation, Customer } from "./types";

function App() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 대화 및 고객 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 대화와 고객 데이터를 병렬로 로드
        const [conversationsResponse, customersResponse] = await Promise.all([
          api.conversations.getAllConversations(),
          api.customers.getAllCustomers(),
        ]);

        setConversations(conversationsResponse.data);
        setCustomers(addRoleToCustomers(customersResponse.data));

        // 첫 번째 대화를 자동 선택
        if (conversationsResponse.data.length > 0 && !selectedConversationId) {
          setSelectedConversationId(conversationsResponse.data[0].id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "데이터를 불러오는 중 오류가 발생했습니다.";
        setError(errorMessage);
        console.error("데이터 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStatusChange = async (
    conversationId: string,
    newStatus: string
  ) => {
    try {
      // API를 통해 상태 업데이트
      const updatedConversation =
        await api.conversations.updateConversationStatus(
          conversationId,
          newStatus as "ai_completed" | "agent_in_progress" | "agent_completed"
        );

      // 로컬 상태 업데이트
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? updatedConversation : conv
        )
      );
    } catch (err) {
      console.error("상태 업데이트 오류:", err);
      // 에러 발생 시 로컬 상태만 업데이트 (fallback)
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, status: newStatus as any }
            : conv
        )
      );
    }
  };

  const handleConversationUpdate = (updatedConversation: AIConversation) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
  };

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  const selectedCustomer = selectedConversation
    ? customers.find(
        (customer) => customer.id === selectedConversation.customerId
      )
    : undefined;

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header agent={mockAgent} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">대화 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header agent={mockAgent} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-medium mb-2">오류 발생</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header agent={mockAgent} />

      <div className="flex-1 flex overflow-hidden">
        <ConversationList
          conversations={conversations}
          customers={customers}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          loading={loading}
          error={error}
        />

        {selectedConversation && selectedCustomer ? (
          <>
            <ChatDisplay
              conversation={selectedConversation}
              customer={selectedCustomer}
              onStatusChange={handleStatusChange}
              onConversationUpdate={handleConversationUpdate}
            />
            <CustomerInfo customer={selectedCustomer} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <img
                src="/image copy.png"
                alt="부엉이들 로고"
                className="h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                AI 상담 대화를 선택하세요
              </h3>
              <p className="text-gray-500">
                왼쪽에서 고객을 선택하면 AI 상담 내역과
                <br />
                분석 결과를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
