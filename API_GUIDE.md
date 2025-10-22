# API 사용 가이드

이 프로젝트는 localhost:3000에서 실행되는 OWLS 백엔드 API와 통신하는 프론트엔드입니다.

## 📁 파일 구조

```
src/
├── api/
│   ├── index.ts          # 메인 API 함수들
│   └── utils.ts          # 유틸리티 함수들
├── types/
│   └── index.ts          # 타입 정의
└── components/
    └── ApiExample.tsx    # API 사용 예제 컴포넌트
```

## 🔧 API 설정

### 환경 변수

- `VITE_BACKEND_URL`: 백엔드 서버 URL (기본값: http://localhost:3000)

### vite.config.ts 설정

```typescript
export default defineConfig({
  define: {
    "import.meta.env.VITE_BACKEND_URL": JSON.stringify("http://localhost:3000"),
  },
});
```

## 📊 사용 가능한 API

### 1. 헬스 체크

```typescript
import { api } from "./api";

// 서버 상태 확인
const health = await api.health.checkHealth();
console.log(health); // { message: "OWLS Backend API", version: "1.0.0", status: "running" }

// API 상태 확인
const apiHealth = await api.health.checkApiHealth();
console.log(apiHealth); // { message: "API is working!", timestamp: "..." }
```

### 2. 대화 관리

```typescript
// 모든 대화 조회
const conversations = await api.conversations.getAllConversations();
console.log(conversations.data); // AIConversation[]

// 특정 대화 조회
const conversation = await api.conversations.getConversationById("conv-1");

// 고객별 대화 조회
const customerConversations =
  await api.conversations.getConversationsByCustomerId("1");

// 새 대화 생성
const newConversation = await api.conversations.createConversation({
  customerId: "1",
  message: "안녕하세요",
});

// 대화에 메시지 추가
const updatedConversation = await api.conversations.addMessageToConversation(
  "conv-1",
  "새로운 메시지"
);

// 대화 상태 업데이트
const statusUpdated = await api.conversations.updateConversationStatus(
  "conv-1",
  "agent_completed"
);
```

### 3. 고객 관리

```typescript
// 모든 고객 조회
const customers = await api.customers.getAllCustomers();
console.log(customers.data); // Customer[]

// 특정 고객 조회
const customer = await api.customers.getCustomerById("1");

// 고객 검색 (이름, 전화번호, 차량번호, 회사명으로 검색)
const searchResults = await api.customers.searchCustomers("조진우");
```

## 🛠️ 유틸리티 함수

### 데이터 로딩

```typescript
import {
  fetchConversationsWithErrorHandling,
  fetchCustomersWithErrorHandling,
  fetchCustomerById,
} from "./api/utils";

// 대화 데이터 로드
const { conversations, error, loading } =
  await fetchConversationsWithErrorHandling();

// 고객 데이터 로드
const { customers, error: customerError } =
  await fetchCustomersWithErrorHandling();

// 특정 고객 정보 로드
const { customer, error: singleCustomerError } = await fetchCustomerById("1");
```

### 통계 계산

```typescript
import {
  calculateConversationStats,
  calculateMessageStats,
  calculateAnalysisStats,
} from "./api/utils";

const conversationStats = calculateConversationStats(conversations);
// { total: 40, aiCompleted: 25, agentInProgress: 5, agentCompleted: 10, ... }

const messageStats = calculateMessageStats(conversations);
// { totalMessages: 200, userMessages: 100, assistantMessages: 100, ... }

const analysisStats = calculateAnalysisStats(conversations);
// {
//   total: 50,
//   priorityStats: { high: 5, medium: 20, low: 25, highPriorityRate: 10 },
//   sentimentStats: { positive: 30, negative: 10, neutral: 10, negativeSentimentRate: 20 },
//   categoryStats: { "정비": 15, "렌탈": 20, "일반문의": 15 }
// }
```

### 검색 및 필터링

```typescript
import {
  searchConversations,
  getRecentConversations,
  filterConversationsByPriority,
  filterConversationsBySentiment,
  filterConversationsByCategory,
  getHighPriorityConversations,
  getNegativeSentimentConversations,
} from "./api/utils";

// 대화 검색 (분석 정보 포함)
const searchResults = searchConversations(conversations, "미납금");

// 최근 대화 (24시간)
const recent = getRecentConversations(conversations, 24);

// 우선순위별 필터링
const highPriority = filterConversationsByPriority(conversations, "high");
const urgentConversations = getHighPriorityConversations(conversations);

// 감정별 필터링
const negativeSentiment = filterConversationsBySentiment(
  conversations,
  "negative"
);
const unhappyCustomers = getNegativeSentimentConversations(conversations);

// 카테고리별 필터링
const maintenanceIssues = filterConversationsByCategory(conversations, "정비");
```

### 에러 처리

```typescript
import { formatApiError } from "./api/utils";

try {
  await api.conversations.getAllConversations();
} catch (error) {
  const errorMessage = formatApiError(error);
  console.error(errorMessage);
}
```

## 🎯 React 컴포넌트에서 사용

### 기본 사용법

```typescript
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { AIConversation, Customer } from "../types";

const ConversationList: React.FC = () => {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 대화와 고객 데이터를 병렬로 로드
        const [conversationsResponse, customersResponse] = await Promise.all([
          api.conversations.getAllConversations(),
          api.customers.getAllCustomers(),
        ]);

        setConversations(conversationsResponse.data);
        setCustomers(customersResponse.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      {conversations.map((conv) => {
        const customer = customers.find((c) => c.id === conv.customerId);
        return (
          <div key={conv.id}>
            <h3>고객: {customer?.name || "알 수 없음"}</h3>
            <p>전화번호: {customer?.phone}</p>
            <p>차량번호: {customer?.vehicleNumber}</p>
            <p>상태: {conv.status}</p>
            <p>메시지 수: {conv.messages.length}</p>
          </div>
        );
      })}
    </div>
  );
};
```

### 커스텀 훅 사용

```typescript
import { useState, useEffect } from "react";
import { fetchConversationsWithErrorHandling } from "../api/utils";

const useConversations = () => {
  const [data, setData] = useState({
    conversations: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchConversationsWithErrorHandling();
      setData(result);
    };
    loadData();
  }, []);

  return data;
};

// 컴포넌트에서 사용
const MyComponent = () => {
  const { conversations, error, loading } = useConversations();
  // ...
};
```

## 🔍 타입 정의

### 주요 타입들

```typescript
interface AIConversation {
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

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    intent?: string;
    confidence?: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🚨 에러 처리

API 함수들은 다음과 같은 에러를 처리합니다:

- **네트워크 에러**: 연결 실패, 타임아웃
- **HTTP 에러**: 404, 500 등 서버 응답 에러
- **JSON 파싱 에러**: 잘못된 응답 형식
- **API 에러**: 서버에서 반환한 에러 메시지

```typescript
import { ApiError } from "./api";

try {
  await api.conversations.getAllConversations();
} catch (error) {
  if (error instanceof ApiError) {
    console.error("API 에러:", error.message);
    console.error("상태 코드:", error.status);
  } else {
    console.error("예상치 못한 에러:", error);
  }
}
```

## 📝 예제 컴포넌트

`src/components/ApiExample.tsx`에서 실제 사용 예제를 확인할 수 있습니다. 이 컴포넌트는:

- 서버 상태 확인
- 대화 데이터 로딩
- 통계 계산 및 표시
- 검색 기능
- 에러 처리

모든 기능을 포함하고 있습니다.

## 🔧 개발 팁

1. **타입 안전성**: 모든 API 응답에 대해 타입을 정의하여 컴파일 타임에 오류를 잡을 수 있습니다.

2. **에러 처리**: 항상 try-catch를 사용하여 에러를 적절히 처리하세요.

3. **로딩 상태**: 사용자 경험을 위해 로딩 상태를 표시하세요.

4. **캐싱**: 필요에 따라 데이터를 캐싱하여 불필요한 API 호출을 줄이세요.

5. **재시도 로직**: 네트워크 에러 시 자동 재시도 로직을 구현하는 것을 고려하세요.
