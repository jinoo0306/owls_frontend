import {
  AIConversation,
  ApiHealthResponse,
  ConversationsResponse,
  Customer,
  HealthResponse,
} from "../types";

// API 기본 설정
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// HTTP 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 기본 fetch 래퍼 함수
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // JSON 파싱 실패 시 원본 텍스트 사용
        errorMessage = errorText || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // 네트워크 에러나 기타 에러
    throw new ApiError(
      error instanceof Error ? error.message : "네트워크 오류가 발생했습니다.",
      0
    );
  }
}

// 헬스 체크 API
export const healthApi = {
  // 서버 상태 확인
  async checkHealth(): Promise<HealthResponse> {
    return apiRequest<HealthResponse>("/");
  },

  // API 상태 확인
  async checkApiHealth(): Promise<ApiHealthResponse> {
    return apiRequest<ApiHealthResponse>("/api");
  },
};

// 대화 관련 API
export const conversationsApi = {
  // 모든 대화 목록 조회
  async getAllConversations(): Promise<ConversationsResponse> {
    return apiRequest<ConversationsResponse>("/api/conversations");
  },

  // 특정 대화 조회
  async getConversationById(id: string): Promise<AIConversation> {
    return apiRequest<AIConversation>(`/api/conversations/${id}`);
  },

  // 고객별 대화 목록 조회
  async getConversationsByCustomerId(
    customerId: string
  ): Promise<AIConversation[]> {
    const response = await this.getAllConversations();
    return response.data.filter((conv) => conv.customerId === customerId);
  },

  // 새로운 대화 생성
  async createConversation(data: {
    customerId: string;
    message: string;
  }): Promise<AIConversation> {
    return apiRequest<AIConversation>("/api/conversations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 대화에 메시지 추가
  async addMessageToConversation(
    conversationId: string,
    message: string
  ): Promise<AIConversation> {
    return apiRequest<AIConversation>(
      `/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
      }
    );
  },

  // 대화 상태 업데이트
  async updateConversationStatus(
    conversationId: string,
    status: "ai_completed" | "agent_in_progress" | "agent_completed"
  ): Promise<AIConversation> {
    return apiRequest<AIConversation>(
      `/api/conversations/${conversationId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },
};

// 고객 관련 API
export const customersApi = {
  // 모든 고객 조회
  async getAllCustomers(): Promise<{
    success: boolean;
    data: Customer[];
    count: number;
  }> {
    return apiRequest<{ success: boolean; data: Customer[]; count: number }>(
      "/api/users"
    );
  },

  // 특정 고객 조회
  async getCustomerById(id: string): Promise<Customer> {
    return apiRequest<Customer>(`/api/users/${id}`);
  },

  // 고객 검색
  async searchCustomers(query: string): Promise<Customer[]> {
    const response = await this.getAllCustomers();
    return response.data.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query) ||
        customer.vehicleNumber.toLowerCase().includes(query.toLowerCase()) ||
        customer.companyName?.toLowerCase().includes(query.toLowerCase())
    );
  },
};

// 통합 API 객체
export const api = {
  health: healthApi,
  conversations: conversationsApi,
  customers: customersApi,
};

// 기본 export
export default api;
