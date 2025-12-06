"use client";

import { useEffect, useState } from "react";
import "./ga4-dashboard.css";
import { getAccessToken } from "@/lib/auth";

interface AnalyticsData {
  pageViews: { page: string; views: number; title?: string }[];
  homepageEvents: { event: string; count: number; details?: string }[];
  userJourneys: { path: string; count: number; avgTime?: number }[];
  purchaseFunnel: {
    step: string;
    count: number;
    dropoff?: number;
    percentage?: number;
  }[];
  errors: { type: string; count: number; message?: string }[];
  apiMetrics: {
    total: number;
    successful: number;
    failed: number;
    avgDuration: number;
  };
}

interface DetailedErrorData {
  total: number;
  summary: Array<{
    type: string;
    count: number;
    uniqueErrors: number;
    details: Array<{
      message: string;
      endpoint: string;
      status: string;
      page: string;
      count: number;
    }>;
  }>;
  topFailingEndpoints: Array<{
    endpoint: string;
    count: number;
  }>;
  period: string;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface LiveUserData {
  id: string;
  ip?: string;
  page: string;
  device: string;
  browser: string;
  location: string;
  country: string;
  city: string;
  source: string;
  pageViews: number;
  userType: string;
  activeUsers: number;
  sessionId?: string;
  lastActivity?: string;
  userName?: string;
  userEmail?: string;
}

interface RealtimeData {
  activeUsers: number;
  totalSessions: number;
  users: LiveUserData[];
  timestamp: string;
  error?: string;
}

export default function GA4Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d" | "90d">("7d");
  const [expandedErrorType, setExpandedErrorType] = useState<string | null>(
    null
  );
  const [detailedErrors, setDetailedErrors] =
    useState<DetailedErrorData | null>(null);
  const [isLoadingErrors, setIsLoadingErrors] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLiveUsers, setShowLiveUsers] = useState(false);
  const [liveUsersData, setLiveUsersData] = useState<RealtimeData | null>(null);
  const [liveUsersLoading, setLiveUsersLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    pageViews: [],
    homepageEvents: [],
    userJourneys: [],
    purchaseFunnel: [],
    errors: [],
    apiMetrics: {
      total: 0,
      successful: 0,
      failed: 0,
      avgDuration: 0,
    },
  });

  const getAuthHeaders = () => {
    const token = getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setExpandedErrorType(null);

    const fetchAnalytics = async () => {
      try {
        const days =
          timeRange === "1d"
            ? 1
            : timeRange === "7d"
            ? 7
            : timeRange === "30d"
            ? 30
            : 90;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/ga4?days=${days}`,
          {
            credentials: "include",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch analytics: ${response.status} ${errorText}`
          );
        }

        const analyticsData = await response.json();
        setData(analyticsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showLiveUsers) {
      interval = setInterval(() => {
        fetchLiveUsers();
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showLiveUsers]);

  const fetchDetailedErrors = async (errorType: string, page: number = 1) => {
    try {
      setIsLoadingErrors(true);
      const days =
        timeRange === "1d"
          ? 1
          : timeRange === "7d"
          ? 7
          : timeRange === "30d"
          ? 30
          : 90;

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/ga4/errors`
      );
      url.searchParams.append("days", days.toString());
      url.searchParams.append("errorType", errorType);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", "30");

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch detailed errors");
      }

      const errorData = await response.json();
      setDetailedErrors(errorData);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching detailed errors:", error);
    } finally {
      setIsLoadingErrors(false);
    }
  };

  const handleErrorTypeClick = (errorType: string) => {
    if (expandedErrorType === errorType) {
      setExpandedErrorType(null);
      setDetailedErrors(null);
      setCurrentPage(1);
    } else {
      setExpandedErrorType(errorType);
      setCurrentPage(1);
      fetchDetailedErrors(errorType, 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (expandedErrorType) {
      fetchDetailedErrors(expandedErrorType, newPage);
    }
  };

  const fetchLiveUsers = async () => {
    try {
      setLiveUsersLoading(true);

      const [ga4Response, visitorsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/ga4/realtime`, {
          credentials: "include",
          headers: getAuthHeaders(),
        }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/live-visitors`, {
          credentials: "include",
          headers: getAuthHeaders(),
        }).catch(() => null),
      ]);

      let ga4Data = null;
      let visitorsData = null;

      if (ga4Response && ga4Response.ok) {
        ga4Data = await ga4Response.json();
      }

      if (visitorsResponse && visitorsResponse.ok) {
        visitorsData = await visitorsResponse.json();
      }

      const combinedUsers =
        visitorsData?.visitors?.map((v: any) => ({
          id: v.id,
          sessionId: v.id,
          ip: v.ip,
          page: v.page,
          device: v.device,
          browser: v.browser || v.os,
          location: (() => {
            const city = v.city && v.city !== "Unknown" ? v.city : null;
            const country =
              v.country && v.country !== "Unknown" ? v.country : null;

            if (city && country) {
              return `${city}, ${country}`;
            } else if (city) {
              return city;
            } else if (country) {
              return country;
            }
            return "Unknown";
          })(),
          pageViews: v.pageViews,
          activeUsers: 1,
          userName: v.userName,
          userEmail: v.userEmail,
        })) || [];

      setLiveUsersData({
        activeUsers: visitorsData?.total || ga4Data?.activeUsers || 0,
        totalSessions: combinedUsers.length,
        users: combinedUsers,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching live users:", error);
      setLiveUsersData({
        activeUsers: 0,
        totalSessions: 0,
        users: [],
        timestamp: new Date().toISOString(),
        error: "Failed to load data",
      });
    } finally {
      setLiveUsersLoading(false);
    }
  };

  const handleLiveUsersClick = () => {
    setShowLiveUsers(!showLiveUsers);
    if (!showLiveUsers && liveUsersData === null) {
      fetchLiveUsers();
    }
  };

  const successRate =
    data.apiMetrics.total > 0
      ? ((data.apiMetrics.successful / data.apiMetrics.total) * 100).toFixed(2)
      : "0";

  const conversionRate =
    data.purchaseFunnel.length > 0 && data.purchaseFunnel[0].count > 0
      ? (
          (data.purchaseFunnel[data.purchaseFunnel.length - 1].count /
            data.purchaseFunnel[0].count) *
          100
        ).toFixed(2)
      : "0";

  return (
    <div className="ga4-dashboard">
      <div className="ga4-dashboard__header">
        <div className="ga4-dashboard__title-section">
          <div className="ga4-dashboard__title-row">
            <div>
              <h1 className="ga4-dashboard__title">📊 ანალიტიკის პანელი</h1>
              <p className="ga4-dashboard__subtitle">
                Google Analytics 4 - ვებსაიტის სრული ანალიტიკა
              </p>
            </div>

            <button
              className="live-users-btn"
              onClick={handleLiveUsersClick}
              disabled={liveUsersLoading}
            >
              <span className="live-indicator"></span>
              ლაივ მომხმარებლები
            </button>
          </div>

          {showLiveUsers && (
            <div className="live-users-panel">
              {liveUsersLoading ? (
                <div className="live-users-loading">
                  <div className="spinner"></div>
                  <span>იტვირთება...</span>
                </div>
              ) : liveUsersData ? (
                <div className="live-users-detailed">
                  <div className="live-users-summary">
                    <div className="live-stat-box">
                      <span className="live-stat-number">
                        {liveUsersData.activeUsers}
                      </span>
                      <span className="live-stat-label">აქტიური</span>
                    </div>
                    <div className="live-stat-box">
                      <span className="live-stat-number">
                        {liveUsersData.totalSessions}
                      </span>
                      <span className="live-stat-label">სესიები</span>
                    </div>
                    <button
                      className="refresh-btn-inline"
                      onClick={fetchLiveUsers}
                      disabled={liveUsersLoading}
                    >
                      🔄 განახლება
                    </button>
                  </div>

                  {liveUsersData.users.length > 0 ? (
                    <div className="live-users-table-wrapper">
                      <table className="live-users-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>მომხმარებელი</th>
                            <th>IP</th>
                            <th>გვერდი</th>
                            <th>მოწყობილობა</th>
                            <th>ლოკაცია</th>
                            <th>ნახვები</th>
                          </tr>
                        </thead>
                        <tbody>
                          {liveUsersData.users.map((user, index) => (
                            <tr key={user.sessionId || user.id}>
                              <td>{index + 1}</td>
                              <td title={user.userEmail || undefined}>
                                {user.userName || (
                                  <span style={{ color: "#999", fontStyle: "italic" }}>
                                    სტუმარი
                                  </span>
                                )}
                              </td>
                              <td title={user.ip}>{user.ip || "—"}</td>
                              <td title={user.page}>
                                <a
                                  href={user.page}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#0066cc" }}
                                >
                                  {user.page}
                                </a>
                              </td>
                              <td>{user.device}</td>
                              <td title={user.location}>{user.location}</td>
                              <td style={{ textAlign: "center" }}>{user.pageViews}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="no-live-users">
                      <p>ბოლო 30 წუთში აქტიური მომხმარებლები არ არიან</p>
                    </div>
                  )}

                  <div className="live-users-footer">
                    <small>
                      ბოლო განახლება:{" "}
                      {new Date(liveUsersData.timestamp).toLocaleTimeString()}
                    </small>
                    <small style={{ opacity: 0.7 }}>
                      ავტომატურად განახლდება ყოველ 30 წამში
                    </small>
                  </div>
                </div>
              ) : (
                <div className="live-users-error">
                  <p>ვერ ჩაიტვირთა მონაცემები</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="ga4-error-message">
              <strong>❌ Error:</strong> {error}
              <br />
              <small>
                შეამოწმეთ სერვერის ლოგები და დარწმუნდით, რომ GA4_CREDENTIALS და
                GA4_PROPERTY_ID სწორად არის კონფიგურირებული.
              </small>
            </div>
          )}
        </div>

        <div className="ga4-dashboard__time-range">
          <button
            className={timeRange === "1d" ? "active" : ""}
            onClick={() => setTimeRange("1d")}
          >
            1 დღე
          </button>
          <button
            className={timeRange === "7d" ? "active" : ""}
            onClick={() => setTimeRange("7d")}
          >
            7 დღე
          </button>
          <button
            className={timeRange === "30d" ? "active" : ""}
            onClick={() => setTimeRange("30d")}
          >
            30 დღე
          </button>
          <button
            className={timeRange === "90d" ? "active" : ""}
            onClick={() => setTimeRange("90d")}
          >
            90 დღე
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ga4-dashboard__loading">
          <div className="spinner"></div>
          <p>იტვირთება...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="ga4-dashboard__metrics">
            <div className="metric-card metric-card--primary">
              <div className="metric-card__icon">🎯</div>
              <div className="metric-card__value">{conversionRate}%</div>
              <div className="metric-card__label">კონვერსია</div>
            </div>

            <div className="metric-card metric-card--success">
              <div className="metric-card__icon">✅</div>
              <div className="metric-card__value">{successRate}%</div>
              <div className="metric-card__label">API წარმატება</div>
            </div>

            <div className="metric-card metric-card--info">
              <div className="metric-card__icon">📄</div>
              <div className="metric-card__value">
                {data.pageViews
                  .reduce((sum, p) => sum + p.views, 0)
                  .toLocaleString()}
              </div>
              <div className="metric-card__label">გვერდის ნახვები</div>
            </div>

            <div className="metric-card metric-card--warning">
              <div className="metric-card__icon">⚠️</div>
              <div className="metric-card__value">
                {data.errors.reduce((sum, e) => sum + e.count, 0)}
              </div>
              <div className="metric-card__label">შეცდომები</div>
            </div>
          </div>

          {/* Page Views */}
          <section className="ga4-section">
            <h2 className="ga4-section__title">📄 გვერდების ნახვები</h2>
            <div className="ga4-table">
              <table>
                <thead>
                  <tr>
                    <th>გვერდი</th>
                    <th>ნახვები</th>
                    <th>წილი</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pageViews.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                        მონაცემები ჯერ არ არის
                      </td>
                    </tr>
                  ) : (
                    data.pageViews.map((page, index) => {
                      const totalViews = data.pageViews.reduce(
                        (sum, p) => sum + p.views,
                        0
                      );
                      const share = totalViews > 0 ? ((page.views / totalViews) * 100).toFixed(1) : "0";

                      return (
                        <tr key={index}>
                          <td>
                            <div className="table-cell-main">{page.page}</div>
                            {page.title && (
                              <div className="table-cell-sub">{page.title}</div>
                            )}
                          </td>
                          <td className="table-cell-number">
                            {page.views.toLocaleString()}
                          </td>
                          <td>
                            <div className="progress-bar">
                              <div
                                className="progress-bar__fill"
                                style={{ width: `${share}%` }}
                              ></div>
                              <span className="progress-bar__label">{share}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Purchase Funnel */}
          <section className="ga4-section">
            <h2 className="ga4-section__title">🛒 შეძენის ფუნელი</h2>
            <div className="funnel-chart">
              {data.purchaseFunnel.length === 0 ? (
                <p style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                  ფუნელის მონაცემები ჯერ არ არის
                </p>
              ) : (
                data.purchaseFunnel.map((step, index) => (
                  <div key={index} className="funnel-step">
                    <div className="funnel-step__bar-container">
                      <div
                        className="funnel-step__bar"
                        style={{ width: `${step.percentage || 0}%` }}
                      >
                        <span className="funnel-step__label">{step.step}</span>
                      </div>
                    </div>
                    <div className="funnel-step__stats">
                      <span className="funnel-step__count">
                        {step.count.toLocaleString()} მომხმარებელი
                      </span>
                      {step.dropoff !== undefined && (
                        <span
                          className="funnel-step__dropoff"
                          style={{ color: step.dropoff < 0 ? "#10b981" : "#ef4444" }}
                        >
                          {-step.dropoff.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Errors & API Metrics */}
          <div className="ga4-section-row">
            <section className="ga4-section ga4-section--half">
              <h2 className="ga4-section__title">⚠️ შეცდომები</h2>
              <div className="error-list">
                {data.errors.map((error, index) => (
                  <div key={index} className="error-item-expandable">
                    <div
                      className="error-item-header"
                      onClick={() => handleErrorTypeClick(error.type)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="error-item-info">
                        <span className="error-item__type">{error.type}</span>
                        <span className="error-item__count">{error.count}</span>
                      </div>
                      <span className="expand-icon">
                        {expandedErrorType === error.type ? "▼" : "▶"}
                      </span>
                    </div>

                    {expandedErrorType === error.type && (
                      <div className="error-details">
                        {isLoadingErrors ? (
                          <div className="loading-details">
                            <div className="spinner"></div>
                            <p>იტვირთება დეტალები...</p>
                          </div>
                        ) : detailedErrors ? (
                          <div className="detailed-errors">
                            <div className="error-stats">
                              <div className="stat-box">
                                <div className="stat-label">სულ შეცდომები</div>
                                <div className="stat-value">
                                  {detailedErrors.total.toLocaleString()}
                                </div>
                              </div>
                              <div className="stat-box">
                                <div className="stat-label">პერიოდი</div>
                                <div className="stat-value">
                                  {detailedErrors.period}
                                </div>
                              </div>
                            </div>

                            {detailedErrors.topFailingEndpoints.length > 0 && (
                              <div className="error-subsection">
                                <h4>პრობლემური ენდპოინტები</h4>
                                <div className="endpoint-list">
                                  {detailedErrors.topFailingEndpoints
                                    .slice(0, 5)
                                    .map((ep, idx) => (
                                      <div key={idx} className="endpoint-item">
                                        <span className="endpoint-path">{ep.endpoint}</span>
                                        <span className="endpoint-count">{ep.count}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {detailedErrors.pagination && (
                              <div className="pagination-controls">
                                <button
                                  className="pagination-btn"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={!detailedErrors.pagination.hasPrevPage}
                                >
                                  ← წინა
                                </button>
                                <span className="pagination-info">
                                  გვერდი {detailedErrors.pagination.page} /{" "}
                                  {detailedErrors.pagination.totalPages}
                                </span>
                                <button
                                  className="pagination-btn"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={!detailedErrors.pagination.hasNextPage}
                                >
                                  შემდეგი →
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p style={{ padding: "1rem", color: "#666" }}>
                            დეტალები არ არის ხელმისაწვდომი
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="ga4-section ga4-section--half">
              <h2 className="ga4-section__title">🔌 API მეტრიკები</h2>
              <div className="api-metrics">
                <div className="api-metric">
                  <span className="api-metric__label">სულ მოთხოვნები:</span>
                  <span className="api-metric__value">
                    {data.apiMetrics.total.toLocaleString()}
                  </span>
                </div>
                <div className="api-metric api-metric--success">
                  <span className="api-metric__label">წარმატებული:</span>
                  <span className="api-metric__value">
                    {data.apiMetrics.successful.toLocaleString()}
                  </span>
                </div>
                <div className="api-metric api-metric--error">
                  <span className="api-metric__label">წარუმატებელი:</span>
                  <span className="api-metric__value">
                    {data.apiMetrics.failed.toLocaleString()}
                  </span>
                </div>
                <div className="api-metric">
                  <span className="api-metric__label">საშ. დრო:</span>
                  <span className="api-metric__value">
                    {data.apiMetrics.avgDuration}ms
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div className="ga4-dashboard__footer">
            <p>📊 Google Analytics 4</p>
            <p>🔄 ბოლო განახლება: {new Date().toLocaleString("ka-GE")}</p>
          </div>
        </>
      )}
    </div>
  );
}
