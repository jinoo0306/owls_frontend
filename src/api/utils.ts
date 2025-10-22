import { AIConversation, Customer } from "../types";
import { api, ApiError } from "./index";

// API 사용 예제 및 유틸리티 함수들

// 대화 데이터를 가져오는 커스텀 훅 스타일 함수
export async function fetchConversationsWithErrorHandling(): Promise<{
  conversations: AIConversation[];
  error: string | null;
  loading: boolean;
}> {
  try {
    const response = await api.conversations.getAllConversations();
    return {
      conversations: response.data,
      error: null,
      loading: false,
    };
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "대화 목록을 불러오는 중 오류가 발생했습니다.";

    return {
      conversations: [],
      error: errorMessage,
      loading: false,
    };
  }
}

// 특정 고객의 대화만 필터링해서 가져오는 함수
export async function fetchCustomerConversations(customerId: string): Promise<{
  conversations: AIConversation[];
  error: string | null;
}> {
  try {
    const conversations = await api.conversations.getConversationsByCustomerId(
      customerId
    );
    return {
      conversations,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "고객 대화를 불러오는 중 오류가 발생했습니다.";

    return {
      conversations: [],
      error: errorMessage,
    };
  }
}

// 고객 데이터를 가져오는 함수
export async function fetchCustomersWithErrorHandling(): Promise<{
  customers: Customer[];
  error: string | null;
  loading: boolean;
}> {
  try {
    const response = await api.customers.getAllCustomers();
    return {
      customers: response.data,
      error: null,
      loading: false,
    };
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "고객 목록을 불러오는 중 오류가 발생했습니다.";

    return {
      customers: [],
      error: errorMessage,
      loading: false,
    };
  }
}

// 특정 고객 정보를 가져오는 함수
export async function fetchCustomerById(customerId: string): Promise<{
  customer: Customer | null;
  error: string | null;
}> {
  try {
    const customer = await api.customers.getCustomerById(customerId);
    return {
      customer,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "고객 정보를 불러오는 중 오류가 발생했습니다.";

    return {
      customer: null,
      error: errorMessage,
    };
  }
}

// 서버 상태 확인 함수
export async function checkServerStatus(): Promise<{
  isOnline: boolean;
  message: string;
  version?: string;
}> {
  try {
    const healthResponse = await api.health.checkHealth();
    return {
      isOnline: true,
      message: healthResponse.message,
      version: healthResponse.version,
    };
  } catch (error) {
    return {
      isOnline: false,
      message:
        error instanceof ApiError
          ? error.message
          : "서버에 연결할 수 없습니다.",
    };
  }
}

// 대화 통계 계산 함수
export function calculateConversationStats(conversations: AIConversation[]) {
  const total = conversations.length;
  const aiCompleted = conversations.filter(
    (c) => c.status === "ai_completed"
  ).length;
  const agentInProgress = conversations.filter(
    (c) => c.status === "agent_in_progress"
  ).length;
  const agentCompleted = conversations.filter(
    (c) => c.status === "agent_completed"
  ).length;

  return {
    total,
    aiCompleted,
    agentInProgress,
    agentCompleted,
    aiCompletionRate: total > 0 ? Math.round((aiCompleted / total) * 100) : 0,
    agentEscalationRate:
      total > 0
        ? Math.round(((agentInProgress + agentCompleted) / total) * 100)
        : 0,
  };
}

// 메시지 통계 계산 함수
export function calculateMessageStats(conversations: AIConversation[]) {
  let totalMessages = 0;
  let userMessages = 0;
  let assistantMessages = 0;

  conversations.forEach((conversation) => {
    conversation.messages.forEach((message) => {
      totalMessages++;
      if (message.role === "user") {
        userMessages++;
      } else {
        assistantMessages++;
      }
    });
  });

  return {
    totalMessages,
    userMessages,
    assistantMessages,
    averageMessagesPerConversation:
      conversations.length > 0
        ? Math.round(totalMessages / conversations.length)
        : 0,
  };
}

// 최근 대화 필터링 함수
export function getRecentConversations(
  conversations: AIConversation[],
  hours: number = 24
): AIConversation[] {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

  return conversations.filter(
    (conversation) => new Date(conversation.startTime) > cutoffTime
  );
}

// 대화 검색 함수
export function searchConversations(
  conversations: AIConversation[],
  query: string
): AIConversation[] {
  if (!query.trim()) return conversations;

  const lowercaseQuery = query.toLowerCase();

  return conversations.filter((conversation) => {
    // 고객 ID로 검색
    if (conversation.customerId.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }

    // 분석 요약으로 검색
    if (conversation.analysis.summary.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }

    // 요청 타입으로 검색
    if (
      conversation.analysis.requestType.toLowerCase().includes(lowercaseQuery)
    ) {
      return true;
    }

    // 메시지 내용으로 검색
    return conversation.messages.some((message) =>
      message.content.toLowerCase().includes(lowercaseQuery)
    );
  });
}

// 분석 정보 기반 필터링 함수들
export function filterConversationsByPriority(
  conversations: AIConversation[],
  priority: "high" | "medium" | "low"
): AIConversation[] {
  return conversations.filter((conv) => conv.analysis.priority === priority);
}

export function filterConversationsBySentiment(
  conversations: AIConversation[],
  sentiment: "positive" | "negative" | "neutral"
): AIConversation[] {
  return conversations.filter((conv) => conv.analysis.sentiment === sentiment);
}

export function filterConversationsByCategory(
  conversations: AIConversation[],
  category: string
): AIConversation[] {
  return conversations.filter((conv) =>
    conv.analysis.category?.toLowerCase().includes(category.toLowerCase())
  );
}

export function getHighPriorityConversations(
  conversations: AIConversation[]
): AIConversation[] {
  return filterConversationsByPriority(conversations, "high");
}

export function getNegativeSentimentConversations(
  conversations: AIConversation[]
): AIConversation[] {
  return filterConversationsBySentiment(conversations, "negative");
}

// 분석 통계 계산 함수
export function calculateAnalysisStats(conversations: AIConversation[]) {
  const total = conversations.length;

  // 우선순위별 통계
  const highPriority = conversations.filter(
    (c) => c.analysis.priority === "high"
  ).length;
  const mediumPriority = conversations.filter(
    (c) => c.analysis.priority === "medium"
  ).length;
  const lowPriority = conversations.filter(
    (c) => c.analysis.priority === "low"
  ).length;

  // 감정별 통계
  const positiveSentiment = conversations.filter(
    (c) => c.analysis.sentiment === "positive"
  ).length;
  const negativeSentiment = conversations.filter(
    (c) => c.analysis.sentiment === "negative"
  ).length;
  const neutralSentiment = conversations.filter(
    (c) => c.analysis.sentiment === "neutral"
  ).length;

  // 카테고리별 통계
  const categoryStats: { [key: string]: number } = {};
  conversations.forEach((conv) => {
    if (conv.analysis.category) {
      categoryStats[conv.analysis.category] =
        (categoryStats[conv.analysis.category] || 0) + 1;
    }
  });

  return {
    total,
    priorityStats: {
      high: highPriority,
      medium: mediumPriority,
      low: lowPriority,
      highPriorityRate:
        total > 0 ? Math.round((highPriority / total) * 100) : 0,
    },
    sentimentStats: {
      positive: positiveSentiment,
      negative: negativeSentiment,
      neutral: neutralSentiment,
      negativeSentimentRate:
        total > 0 ? Math.round((negativeSentiment / total) * 100) : 0,
    },
    categoryStats,
  };
}

// 고객 데이터에 역할 정보 추가 (백엔드에서 role 필드가 없을 때 임시로 사용)
export function addRoleToCustomers(customers: Customer[]): Customer[] {
  return customers.map((customer) => {
    // role 필드가 이미 있으면 그대로 사용
    if (customer.role) {
      return customer;
    }

    // role이 없으면 customerType과 companyName을 기반으로 추론
    let role: "배달대행사" | "소속 점주" | "프리랜서 라이더" | "기타" = "기타";

    if (customer.customerType === "delivery_agency") {
      role = "배달대행사";
    } else if (customer.customerType === "rider") {
      role = "프리랜서 라이더";
    } else if (customer.companyName && customer.companyName.includes("점")) {
      role = "소속 점주";
    }

    return {
      ...customer,
      role,
    };
  });
}

// 에러 메시지 포맷팅 함수
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "네트워크 연결을 확인해주세요.";
    }
    if (error.status === 404) {
      return "요청한 데이터를 찾을 수 없습니다.";
    }
    if (error.status === 500) {
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}
