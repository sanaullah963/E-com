"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  } from "react-icons/fi";
import { getAdminOrdersApi } from "@/services/admin.service.js";
import { formatPrice, getPlaceholderImage } from "@/utils/helpers.js";
import { OMS_URL } from "@/constants/index.js";

// ── Helpers ──────────────────────────────
const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-gray-100 text-gray-700",
};

const TIMELINE_ICONS = {
  pending: "🕐",
  confirmed: "✅",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "🎉",
  cancelled: "❌",
  returned: "↩️",
  call_not_received: "📵",
  phone_off: "📴",
  custom: "📝",
  courier_update: "📦",
};

// ── Timeline Component ──────────────────────────────
function Timeline({ activities = [] }) {
  if (!activities.length)
    return (
      <p className="text-xs text-surface-400 text-center py-3">
        কোনো activity নেই
      </p>
    );

  return (
    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
      {[...activities].reverse().map((act, i) => {
        const dt = formatDateTime(act.updatedAt || act.createdAt);
        return (
          <div key={i} className="flex gap-2.5 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-base leading-none">
                {TIMELINE_ICONS[act.status] || "•"}
              </span>
              {i < activities.length - 1 && (
                <div className="w-px flex-1 bg-surface-200 mt-1" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-surface-800 capitalize">
                  {act.status?.replace(/_/g, " ")}
                </span>
                <span className="text-surface-400">
                  {dt.date} {dt.time}
                </span>
              </div>
              {act.note && (
                <p className="text-surface-500 mt-0.5 bg-surface-50 rounded px-2 py-1 border border-surface-100">
                  {act.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Order Detail Row ──────────────────────────────
function OrderDetailRow({ order }) {
  return (
    <tr>
      <td colSpan={8} className="px-0 py-0 bg-surface-50">
        <div className="px-4 py-4 border-t border-surface-200">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Products */}
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                পণ্য ({order.items?.length})
              </p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 bg-white rounded-lg p-2.5 border border-surface-100"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <FiPackage className="w-5 h-5 text-surface-300 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-surface-400">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-surface-800">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="mt-3 bg-white rounded-lg p-3 border border-surface-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-surface-500">Subtotal</span>
                  <span>{formatPrice(order.pricing?.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Delivery</span>
                  <span>{formatPrice(order.pricing?.deliveryCharge)}</span>
                </div>
                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.pricing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-surface-100 pt-1">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {formatPrice(order.pricing?.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address + Quick Actions */}
            <div className="space-y-3">
              {/* Address */}
              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                  ঠিকানা
                </p>
                <div className="bg-white rounded-lg p-3 border border-surface-100 text-xs space-y-1">
                  <p className="font-semibold text-surface-800">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p className="text-surface-500 flex items-center gap-1">
                    <FiPhone className="w-3 h-3" />
                    {order.shippingAddress?.phone}
                  </p>
                  {order.shippingAddress?.altPhone && (
                    <p className="text-surface-500 flex items-center gap-1">
                      <FiPhone className="w-3 h-3" />
                      {order.shippingAddress.altPhone}
                    </p>
                  )}
                  <p className="text-surface-500 flex items-start gap-1">
                    <FiMapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>
                      {order.shippingAddress?.addressLine}
                      {order.shippingAddress?.area &&
                        `, ${order.shippingAddress.area}`}
                      , {order.shippingAddress?.district}
                    </span>
                  </p>
                </div>
              </div>

              {/* স্টাফ নোট (OMS-এ যোগ হয়) */}
              {order.adminNote && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 text-xs">
                  <p className="text-yellow-700 font-semibold mb-0.5 flex items-center gap-1">
                    <FiMessageSquare className="w-3 h-3" /> নোট:
                  </p>
                  <p className="text-yellow-800">{order.adminNote}</p>
                </div>
              )}

              {/* Courier (OMS/Steadfast — শুধু দেখা) + OMS লিংক */}
              <div>
                {order.courier?.trackingId ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-xs">
                    <p className="text-green-700 font-semibold">✅ Steadfast এ পাঠানো হয়েছে</p>
                    <p className="text-green-600 mt-0.5">
                      ID: <span className="font-mono">{order.courier.trackingId}</span>
                      {order.courier.courierStatus && order.courier.courierStatus !== "unknown" && (
                        <span className="ml-2 capitalize">({String(order.courier.courierStatus).replace(/_/g, " ")})</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="bg-surface-50 border border-surface-200 rounded-lg p-2.5 text-xs text-surface-500">
                    কুরিয়ারে এখনো পাঠানো হয়নি
                  </div>
                )}
                <p className="text-xs text-surface-400 mt-2">
                  স্ট্যাটাস পরিবর্তন, কুরিয়ার বুকিং ও নোট OMS ড্যাশবোর্ডে করুন।
                  {OMS_URL && (
                    <>
                      {" "}
                      <a href={OMS_URL} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium hover:underline">
                        OMS খুলুন ↗
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                Activity Timeline
              </p>
              <div className="bg-white rounded-lg p-3 border border-surface-100">
                <Timeline activities={order.statusHistory || []} />
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Status Tabs ──────────────────────────────
const STATUS_TABS = [
  { key: "", label: "সব" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Main Page ──────────────────────────────
export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-orders",
      { search, status: statusFilter, page, dateFrom, dateTo },
    ],
    queryFn: () =>
      getAdminOrdersApi({
        search,
        status: statusFilter,
        page,
        limit: 20,
        dateFrom,
        dateTo,
      }),
    refetchInterval: 30000,
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  // Status counts
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const toggleExpand = (id) =>
    setExpandedOrder(expandedOrder === id ? null : id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="text-2xl font-bold text-surface-900">
          অর্ডার ম্যানেজমেন্ট
        </h1>
        {OMS_URL && (
          <a
            href={OMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            OMS-এ ম্যানেজ করুন ↗
          </a>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-surface-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setStatusFilter(tab.key);
              setPage(1);
            }}
            className={`flex-shrink-0 text-xs px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              statusFilter === tab.key
                ? "bg-white text-surface-800 shadow-sm"
                : "text-surface-500 hover:bg-white/60"
            }`}
          >
            {tab.label}
            {tab.key === "" ? (
              <span className="ml-1.5 bg-surface-200 text-surface-600 text-xs px-1.5 py-0.5 rounded-full">
                {pagination?.totalCount || orders.length}
              </span>
            ) : statusCounts[tab.key] ? (
              <span className="ml-1.5 bg-surface-200 text-surface-600 text-xs px-1.5 py-0.5 rounded-full">
                {statusCounts[tab.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Order ID, ফোন, নাম..."
            className="input pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4 text-surface-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input text-sm py-2 w-36"
          />
          <span className="text-surface-400">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input text-sm py-2 w-36"
          />
        </div>
        {(search || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setSearch("");
              setDateFrom("");
              setDateTo("");
            }}
            className="btn-ghost text-sm text-red-500"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 border-b border-surface-100">
              <tr>
                <th className="w-8 px-2 py-3" />
                {[
                  "Order ID",
                  "Customer",
                  "Items",
                  "Total",
                  "Payment",
                  "Status",
                  "Date",
                  "Courier",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-3">
                      <div className="h-4 bg-surface-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-surface-400"
                  >
                    <FiPackage className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>কোনো অর্ডার পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const dt = formatDateTime(order.createdAt);
                  const isExpanded = expandedOrder === order._id;

                  return (
                    <Fragment key={order._id}>
                      <tr
                        // key={order._id}
                        className={`transition-colors cursor-pointer ${isExpanded ? "bg-primary-50/30" : "hover:bg-surface-50"}`}
                        onClick={() => toggleExpand(order._id)}
                      >
                        <td className="px-2 py-3">
                          {isExpanded ? (
                            <FiChevronUp className="w-4 h-4 text-primary-600" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 text-surface-400" />
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-mono font-bold text-primary-600 text-xs">
                            {order.orderId}
                          </p>
                          {order.adminNote && (
                            <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                              <FiMessageSquare className="w-3 h-3" />
                              <span className="truncate max-w-[100px]">
                                {order.adminNote}
                              </span>
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-surface-800">
                            {order.shippingAddress?.fullName}
                          </p>
                          <p className="text-xs text-surface-400">
                            {order.shippingAddress?.phone}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-surface-600">
                          {order.items?.length} টি
                        </td>

                        <td className="px-4 py-3 font-bold text-surface-800">
                          {formatPrice(order.pricing?.total)}
                        </td>

                        <td className="px-4 py-3">
                          <span className="uppercase text-xs font-semibold text-surface-600 bg-surface-100 px-2 py-0.5 rounded">
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || ""}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        {/* Date + Time */}
                        <td className="px-4 py-3">
                          <p className="text-xs text-surface-600 font-medium">
                            {dt.date}
                          </p>
                          <p className="text-xs text-surface-400">{dt.time}</p>
                        </td>

                        {/* Courier (শুধু দেখা) */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {order.courier?.trackingId ? (
                            <span className="text-xs font-mono text-green-700" title="Steadfast">
                              ✅ {order.courier.trackingId}
                            </span>
                          ) : (
                            <span className="text-xs text-surface-400">—</span>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <OrderDetailRow
                          key={`detail-${order._id}`}
                          order={order}
                        />
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-surface-100 flex items-center justify-between">
            <p className="text-xs text-surface-500">
              মোট <span className="font-bold">{pagination.totalCount}</span> টি
              অর্ডার
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-surface-50"
              >
                আগে
              </button>
              <span className="px-3 py-1 text-xs bg-primary-600 text-white rounded-lg">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-surface-50"
              >
                পরে
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
