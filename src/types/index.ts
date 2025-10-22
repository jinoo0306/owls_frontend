export interface Customer {
  id: string;
  name: string;
  phone: string;
  companyName?: string;
  representativeName?: string;
  representativePhone?: string;
  vehicleNumber: string;
  customerType: "delivery_agency" | "rider" | "other";
  role?: "배달대행사" | "소속 점주" | "프리랜서 라이더" | "기타";
  currentRental?: {
    bikeModel: string;
    startDate: string;
    isActive: boolean;
    serviceType: "lease" | "rental";
    productType: "takeover" | "return" | "own_vehicle";
  };
  stats: {
    operatingVehicles?: number; // 배달대행사용
    usageDays?: number; // 라이더용
    depositAmount: number;
  };
  vehicleList?: Vehicle[];
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  status: "active" | "maintenance" | "inactive";
  rider: string;
  startDate: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    intent?: string;
    confidence?: number;
  };
}

export interface AIConversation {
  id: string;
  customerId: string;
  status: "ai_completed" | "agent_in_progress" | "agent_completed";
  startTime: string;
  endTime?: string;
  messages: AIMessage[];
  analysis: {
    summary: string;
    requestType: string;
    inquiryDetails: string;
    recommendedAction: string;
    // 추가 분석 필드들 (향후 확장 가능)
    sentiment?: "positive" | "negative" | "neutral";
    priority?: "high" | "medium" | "low";
    category?: string;
    keywords?: string[];
    confidence?: number;
    estimatedResolutionTime?: string;
    relatedIssues?: string[];
  };
}

export interface Agent {
  id: string;
  name: string;
  status: "online" | "busy" | "offline";
  activeConversations: number;
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: AIConversation[];
  count: number;
}

export interface HealthResponse {
  message: string;
  version: string;
  status: string;
}

export interface ApiHealthResponse {
  message: string;
  timestamp: string;
}
