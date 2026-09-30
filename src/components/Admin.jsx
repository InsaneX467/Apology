import React, { useState, useEffect } from 'react';
import { fetchAdminResponses } from '../services/api';

export default function Admin() {
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Auto-login if secret stored in sessionStorage
  useEffect(() => {
    const savedSecret = sessionStorage.getItem('admin_secret');
    if (savedSecret) {
      setAdminSecret(savedSecret);
      loadResponses(savedSecret);
    }
  }, []);

  const loadResponses = async (secretToUse) => {
    setLoading(true);
    setErrorMsg('');
    const res = await fetchAdminResponses(secretToUse || adminSecret);
    setLoading(false);

    if (res && res.success) {
      setIsAuthenticated(true);
      setData(res);
      sessionStorage.setItem('admin_secret', secretToUse || adminSecret);
    } else {
      setIsAuthenticated(false);
      setErrorMsg(res?.message || 'Invalid secret key or backend server unreachable.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!adminSecret.trim()) return;
    loadResponses(adminSecret);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_secret');
    setIsAuthenticated(false);
    setData(null);
    setAdminSecret('');
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')';
  };

  const getOptionBadgeClass = (option) => {
    if (option.includes('Tonight')) return 'badge-tonight';
    if (option.includes('1 Day')) return 'badge-1day';
    if (option.includes('2 Days')) return 'badge-2days';
    return '';
  };

  return (
    <div className="admin-wrapper fade-step">
      <div className="admin-card card-base">
        <div className="admin-header">
          <h1 className="admin-title">🔒 Private Admin Panel</h1>
          <p className="admin-subtitle">Response history & selection metrics</p>
        </div>

        {!isAuthenticated ? (
          <form className="admin-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="secret-input">Enter Admin Secret:</label>
              <input
                id="secret-input"
                type="password"
                className="admin-input"
                placeholder="e.g. apology-secret-123"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
              />
            </div>
            {errorMsg && <div className="admin-error">{errorMsg}</div>}
            <button type="submit" className="btn-cute" disabled={loading}>
              {loading ? 'Verifying...' : 'Access Dashboard 🔓'}
            </button>
          </form>
        ) : (
          <div className="admin-dashboard">
            {/* Metrics Header */}
            <div className="metrics-row">
              <div className="metric-card">
                <span className="metric-value">{data?.metrics?.totalResponses || 0}</span>
                <span className="metric-label">Total Responses</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">{data?.metrics?.twoDayRequestsTotal || 0}</span>
                <span className="metric-label">2-Day Requests</span>
              </div>
            </div>

            <div className="dashboard-actions">
              <button className="btn-cute btn-small" onClick={() => loadResponses(adminSecret)}>
                🔄 Refresh
              </button>
              <button className="btn-secondary-cute" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>

            {/* Desktop Responses Table */}
            <div className="table-responsive desktop-only-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Option Selected</th>
                    <th>Time</th>
                    <th>Session ID</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.responses && data.responses.length > 0 ? (
                    data.responses.map((resp) => (
                      <tr key={resp._id}>
                        <td>
                          <span className={`option-tag ${getOptionBadgeClass(resp.selectedOption)}`}>
                            {resp.selectedOption}
                          </span>
                        </td>
                        <td>{formatTime(resp.createdAt)}</td>
                        <td className="session-col" title={resp.sessionId}>
                          {resp.sessionId ? resp.sessionId.substring(0, 12) + '...' : 'anon'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No responses recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Response Cards */}
            <div className="admin-cards-list mobile-only-cards">
              {data?.responses && data.responses.length > 0 ? (
                data.responses.map((resp) => (
                  <div key={resp._id} className="admin-response-card">
                    <div className="card-top-row">
                      <span className={`option-tag ${getOptionBadgeClass(resp.selectedOption)}`}>
                        {resp.selectedOption}
                      </span>
                      <span className="card-time">{formatTime(resp.createdAt)}</span>
                    </div>
                    <div className="card-session-id">
                      Session: {resp.sessionId ? resp.sessionId.substring(0, 16) + '...' : 'anon'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                  No responses recorded yet.
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a href="/" className="back-link">
                ← Back to Apology Experience
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
