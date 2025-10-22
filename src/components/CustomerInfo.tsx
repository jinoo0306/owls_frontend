import {
  AlertTriangle,
  Bike,
  Building,
  Calendar,
  ChevronDown,
  Clock,
  Phone,
  Users,
  Wrench,
  X,
} from "lucide-react";
import React from "react";
import { Customer } from "../types";

interface CustomerInfoProps {
  customer: Customer;
}

export default function CustomerInfo({ customer }: CustomerInfoProps) {
  const [showCompanyDetails, setShowCompanyDetails] = React.useState(false);
  const [showVehicleModal, setShowVehicleModal] = React.useState(false);

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

  const getServiceTypeLabel = (type: string) => {
    return type === "lease" ? "리스" : "렌탈";
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "takeover":
        return "인수형";
      case "return":
        return "반납형";
      case "own_vehicle":
        return "자차";
      default:
        return "인수형";
    }
  };

  const getVehicleStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "운행중";
      case "maintenance":
        return "정비중";
      case "inactive":
        return "비활성";
      default:
        return "운행중";
    }
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getVehicleStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Bike className="w-4 h-4" />;
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "inactive":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bike className="w-4 h-4" />;
    }
  };
  return (
    <div className="w-80 bg-white border-l border-gray-100 overflow-y-auto">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">고객 정보</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 고객 프로필 카드 */}
        <div className="text-center pb-4 border-b border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white text-2xl font-bold">
              {customer.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {customer.name}
          </h2>
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getCustomerRoleColor(
              customer
            )}`}
          >
            {getCustomerRoleLabel(customer)}
          </span>
        </div>

        {/* 기본 정보 */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">연락처</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {customer.phone}
                </div>
                <div className="text-xs text-gray-500">휴대폰</div>
              </div>
            </div>
            {customer.companyName && (
              <div className="bg-gray-50 rounded-xl">
                <div
                  className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setShowCompanyDetails(!showCompanyDetails)}
                >
                  <Building className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.companyName}
                    </div>
                    <div className="text-xs text-gray-500">업체명</div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      showCompanyDetails ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {showCompanyDetails && customer.representativeName && (
                  <div className="px-3 pb-3 space-y-2 border-t border-gray-200 pt-2 mt-2">
                    <div className="text-sm">
                      <span className="text-gray-500">대표자명: </span>
                      <span className="font-medium text-gray-900">
                        {customer.representativeName}
                      </span>
                    </div>
                    {customer.representativePhone && (
                      <div className="text-sm">
                        <span className="text-gray-500">대표자 연락처: </span>
                        <span className="font-medium text-gray-900">
                          {customer.representativePhone}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {customer.vehicleNumber}
                </div>
                <div className="text-xs text-gray-500">차량번호</div>
              </div>
            </div>
          </div>
        </div>

        {/* 현재 렌탈 정보 */}
        {customer.currentRental && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">현재 렌탈</h4>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Bike className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">
                  {getServiceTypeLabel(customer.currentRental.serviceType)}
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">모델</span>
                  <span className="text-sm font-semibold text-green-900">
                    {customer.currentRental.bikeModel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">상품유형</span>
                  <span className="text-sm font-semibold text-green-900">
                    {getProductTypeLabel(customer.currentRental.productType)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">렌탈 시작</span>
                  <span className="text-sm text-green-800">
                    {new Date(
                      customer.currentRental.startDate
                    ).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 통계 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`bg-blue-50 rounded-xl p-4 text-center ${
                customer.customerType === "delivery_agency"
                  ? "cursor-pointer hover:bg-blue-100 transition-colors"
                  : ""
              }`}
              onClick={() => {
                if (customer.customerType === "delivery_agency") {
                  setShowVehicleModal(true);
                }
              }}
            >
              <div className="text-2xl font-bold text-blue-600 mb-1 flex items-baseline justify-center">
                {customer.customerType === "delivery_agency" ? (
                  <>
                    <span>{customer.stats.operatingVehicles || 0}</span>
                    <span className="text-lg font-normal ml-1">대</span>
                  </>
                ) : (
                  <>
                    <span>{customer.stats.usageDays || 0}</span>
                    <span className="text-lg font-normal ml-1">일</span>
                  </>
                )}
              </div>
              <div className="text-xs text-blue-700 font-medium flex items-center justify-center space-x-1">
                {customer.customerType === "delivery_agency" ? (
                  <>
                    <Users className="w-3 h-3" />
                    <span>운용대수</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>사용일수</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1 flex items-baseline justify-center">
                <span>{customer.stats.depositAmount.toLocaleString()}</span>
                <span className="text-lg font-normal ml-1">원</span>
              </div>
              <div className="text-xs text-green-700 font-medium">보증금액</div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="space-y-2 pt-4 border-t border-gray-100"></div>
      </div>

      {/* 차량 목록 모달 */}
      {showVehicleModal && customer.vehicleList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                운용 차량 목록
              </h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {customer.vehicleList.map((vehicle) => (
                  <div key={vehicle.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bike className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {vehicle.vehicleNumber}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {vehicle.model}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium flex items-center space-x-1 ${getVehicleStatusColor(
                          vehicle.status
                        )}`}
                      >
                        {getVehicleStatusIcon(vehicle.status)}
                        <span>{getVehicleStatusLabel(vehicle.status)}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">라이더: </span>
                        <span className="font-medium text-gray-900">
                          {vehicle.rider}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">시작일: </span>
                        <span className="font-medium text-gray-900">
                          {new Date(vehicle.startDate).toLocaleDateString(
                            "ko-KR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
