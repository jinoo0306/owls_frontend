import { AIConversation, Agent, Customer } from "../types";

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "김철수",
    phone: "010-1234-5678",
    companyName: "부엉이 모터",
    representativeName: "김철수",
    representativePhone: "010-1234-5678",
    vehicleNumber: "12가3456",
    customerType: "delivery_agency",
    currentRental: {
      bikeModel: "혼다 PCX 150",
      startDate: "2024-12-01",
      isActive: true,
      serviceType: "lease",
      productType: "takeover",
    },
    stats: {
      operatingVehicles: 12,
      depositAmount: 500000,
    },
    vehicleList: [
      {
        id: "v1",
        vehicleNumber: "12가3456",
        model: "혼다 PCX 150",
        status: "active",
        rider: "김철수",
        startDate: "2024-12-01",
      },
      {
        id: "v2",
        vehicleNumber: "34나5678",
        model: "야마하 NMAX 155",
        status: "active",
        rider: "박영희",
        startDate: "2024-11-28",
      },
      {
        id: "v3",
        vehicleNumber: "56다7890",
        model: "혼다 PCX 150",
        status: "maintenance",
        rider: "이민준",
        startDate: "2024-11-15",
      },
      {
        id: "v4",
        vehicleNumber: "78라9012",
        model: "야마하 NMAX 155",
        status: "active",
        rider: "최수진",
        startDate: "2024-12-05",
      },
      {
        id: "v5",
        vehicleNumber: "90마3456",
        model: "혼다 PCX 150",
        status: "active",
        rider: "정민호",
        startDate: "2024-11-20",
      },
    ],
  },
  {
    id: "2",
    name: "박영희",
    phone: "010-9876-5432",
    companyName: "스피드 딜리버리",
    representativeName: "박영희",
    representativePhone: "010-9876-5432",
    vehicleNumber: "34나5678",
    customerType: "rider",
    currentRental: {
      bikeModel: "야마하 NMAX 155",
      startDate: "2024-11-28",
      isActive: true,
      serviceType: "rental",
      productType: "return",
    },
    stats: {
      usageDays: 45,
      depositAmount: 300000,
    },
  },
  {
    id: "3",
    name: "이민준",
    phone: "010-5555-1234",
    companyName: "퀵서비스 플러스",
    representativeName: "이민준",
    representativePhone: "010-5555-1234",
    vehicleNumber: "56다7890",
    customerType: "other",
    stats: {
      usageDays: 15,
      depositAmount: 200000,
    },
  },
];

export const mockConversations: AIConversation[] = [
  {
    id: "conv-1",
    customerId: "1",
    status: "agent_in_progress",
    startTime: "2024-12-15T09:30:00Z",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content:
          "안녕하세요. 오토바이에서 이상한 소리가 나는데 확인 부탁드려요.",
        timestamp: "2024-12-15T09:30:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "안녕하세요! 부엉이들 AI 상담원입니다. 오토바이에서 나는 소리에 대해 문의해주셨네요. 어떤 종류의 소리인지 더 자세히 설명해주실 수 있나요?",
        timestamp: "2024-12-15T09:30:15Z",
        metadata: {
          intent: "maintenance_inquiry",
          confidence: 0.92,
        },
      },
      {
        id: "msg-3",
        role: "user",
        content:
          "브레이크를 밟을 때 끼익끼익 소리가 나요. 어제부터 갑자기 시작됐어요.",
        timestamp: "2024-12-15T09:31:00Z",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "브레이크 소음은 안전과 직결되는 문제입니다! 즉시 점검이 필요해 보이네요. 가까운 부엉이들 정비소 방문을 권장드리며, 긴급 출장 정비도 가능합니다. 상담원 연결을 도와드릴까요?",
        timestamp: "2024-12-15T09:31:30Z",
        metadata: {
          intent: "urgent_maintenance",
          confidence: 0.95,
        },
      },
    ],
    analysis: {
      summary: "브레이크 소음으로 인한 긴급 정비 요청",
      requestType: "긴급 정비 서비스",
      inquiryDetails: "브레이크를 밟을 때 끼익끼익 소리 발생, 어제부터 시작",
      recommendedAction:
        "즉시 정비소 방문 안내 및 긴급 출장 정비 서비스 예약 지원",
    },
  },
  {
    id: "conv-2",
    customerId: "2",
    status: "agent_completed",
    startTime: "2024-12-15T08:15:00Z",
    endTime: "2024-12-15T08:25:00Z",
    messages: [
      {
        id: "msg-5",
        role: "user",
        content: "이번 달 렌탈 요금이 평소보다 많이 나왔는데 확인해주세요.",
        timestamp: "2024-12-15T08:15:00Z",
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "안녕하세요! 부엉이들 AI입니다. 렌탈 요금 관련 문의주셨네요. 이번 달 사용 내역을 확인해보겠습니다. 혹시 평소와 다른 추가 서비스를 이용하셨나요?",
        timestamp: "2024-12-15T08:15:20Z",
      },
      {
        id: "msg-7",
        role: "user",
        content:
          "특별히 추가로 이용한 건 없는데요. 기본 월 렌탈비만 나와야 하는데 왜 이렇게 많이 나왔는지 모르겠어요.",
        timestamp: "2024-12-15T08:16:00Z",
      },
      {
        id: "msg-8",
        role: "assistant",
        content:
          "확인 결과 이번 달 연장 요금과 보험료가 추가 적용되었네요. 정확한 내역 확인을 위해 전문 상담원에게 연결해드리겠습니다!",
        timestamp: "2024-12-15T08:16:45Z",
      },
    ],
    analysis: {
      summary: "월 렌탈 요금 과다 청구 문의",
      requestType: "요금 내역 확인 및 정정",
      inquiryDetails: "평소보다 높은 렌탈 요금, 추가 서비스 이용 없음",
      recommendedAction:
        "결제 내역 상세 확인 후 잘못된 청구 여부 검토 및 정정 처리",
    },
  },
  {
    id: "conv-3",
    customerId: "3",
    status: "ai_completed",
    startTime: "2024-12-15T10:00:00Z",
    messages: [
      {
        id: "msg-9",
        role: "user",
        content: "새로운 오토바이 모델 문의드려요.",
        timestamp: "2024-12-15T10:00:00Z",
      },
      {
        id: "msg-10",
        role: "assistant",
        content:
          "안녕하세요! 부엉이들 AI입니다. 새로운 모델에 관심 가져주셔서 감사해요! 현재 인기 모델을 확인해드릴게요.",
        timestamp: "2024-12-15T10:00:15Z",
      },
      {
        id: "msg-11",
        role: "user",
        content: "배달용으로 쓸 건데 연비 좋고 안정적인 모델 추천해주세요.",
        timestamp: "2024-12-15T10:01:00Z",
      },
      {
        id: "msg-12",
        role: "assistant",
        content:
          "배달용으로는 혼다 PCX 150과 야마하 NMAX 155를 추천드려요! PCX 150은 연비가 리터당 45km로 우수하고, NMAX 155는 파워와 안정성이 뛰어납니다. 두 모델 모두 현재 재고가 있어 즉시 렌탈 가능합니다. 어떤 모델이 더 관심 있으신가요?",
        timestamp: "2024-12-15T10:01:30Z",
      },
      {
        id: "msg-13",
        role: "user",
        content: "PCX 150으로 하고 싶은데 월 렌탈료는 얼마인가요?",
        timestamp: "2024-12-15T10:02:00Z",
      },
      {
        id: "msg-14",
        role: "assistant",
        content:
          "PCX 150 월 렌탈료는 개인사업자 기준 월 28만원입니다. 보험료 포함이며, 정비는 무료로 제공됩니다. 계약서 작성과 차량 인수는 가까운 부엉이들 지점에서 가능해요. 바로 예약 도와드릴까요?",
        timestamp: "2024-12-15T10:02:45Z",
      },
    ],
    analysis: {
      summary: "AI가 배달용 오토바이 추천 및 렌탈료 안내 완료",
      requestType: "상품 추천 및 가격 문의 (AI 해결 완료)",
      inquiryDetails:
        "배달용 오토바이 추천 요청, PCX 150 모델 선택 및 렌탈료 문의",
      recommendedAction:
        "AI가 모델 추천과 가격 안내를 완료했으며, 예약 진행 시에만 상담원 지원 필요",
    },
  },
];

export const mockAgent: Agent = {
  id: "agent-1",
  name: "박유주",
  status: "online",
  activeConversations: 2,
};
