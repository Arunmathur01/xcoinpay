import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const [kycs, setKycs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();

  const fetchKycs = async (status = 'pending') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthRequired(true);
        setKycs([]);
        setLoading(false);
        return;
      }
      const res = await axios.get(`/api/admin/kyc${status ? `?status=${status}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKycs(res.data?.kycs || []);
      setAuthRequired(false);
    } catch (e) {
      const code = e?.response?.status;
      if (code === 401 || code === 403) {
        setAuthRequired(true);
        setKycs([]);
      } else {
        alert(e.response?.data?.message || 'Failed to load KYCs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycs(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const act = async (kycId, action) => {
    const confirmMsg = `Are you sure you want to ${action} this KYC?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/kyc/${kycId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchKycs(statusFilter);
    } catch (e) {
      alert(e.response?.data?.message || `Failed to ${action}`);
    }
  };

  const adminLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/admin/login', { email: adminEmail, password: adminPassword });
      const token = res.data?.token;
      if (!token) {
        alert('Login failed');
        return;
      }
      localStorage.setItem('token', token);
      setAuthRequired(false);
      await fetchKycs(statusFilter);
    } catch (e) {
      alert(e.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const map = {
      approved: { bg: '#d4edda', color: '#155724' },
      rejected: { bg: '#f8d7da', color: '#721c24' },
      pending: { bg: '#fff3cd', color: '#856404' }
    };
    const s = map[status] || { bg: '#e9ecef', color: '#333' };
    return (
      <span style={{ padding: '4px 10px', borderRadius: 12, background: s.bg, color: s.color, fontWeight: 600, fontSize: 12 }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: 12 }}>Admin - KYC Review</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
        <button onClick={() => fetchKycs(statusFilter)} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        <button onClick={() => navigate('/')}>← Back</button>
      </div>

      {authRequired && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Admin Login Required</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="email" placeholder="Admin Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={{ padding: 8, minWidth: 220 }} />
            <input type="password" placeholder="Admin Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} style={{ padding: 8, minWidth: 180 }} />
            <button onClick={adminLogin} disabled={loading}>{loading ? 'Signing in…' : 'Admin Login'}</button>
          </div>
          <div style={{ marginTop: 8, color: '#6c757d' }}>Or sign in as OWNER (email must equal OWNER_EMAIL) and refresh.</div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f3f5' }}>
              <th style={{ textAlign: 'left', padding: 10 }}>User</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Email</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Full Name</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Country</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Submitted</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Reviewed</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: 16, textAlign: 'center', color: '#666' }}>No records</td>
              </tr>
            )}
            {kycs.map(k => (
              <>
                <tr key={k._id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: 10 }}>
                    <button onClick={() => setExpandedId(expandedId === k._id ? null : k._id)} style={{ marginRight: 8 }}>
                      {expandedId === k._id ? '▾' : '▸'}
                    </button>
                    {k.user?.name || '-'}
                  </td>
                  <td style={{ padding: 10 }}>{k.user?.email || '-'}</td>
                  <td style={{ padding: 10 }}>{k.fullName || '-'}</td>
                  <td style={{ padding: 10 }}>{k.country || '-'}</td>
                  <td style={{ padding: 10 }}>{k.submittedAt ? new Date(k.submittedAt).toLocaleString() : '-'}</td>
                  <td style={{ padding: 10 }}>{k.reviewedAt ? new Date(k.reviewedAt).toLocaleString() : '-'}</td>
                  <td style={{ padding: 10 }}><StatusBadge status={k.status} /></td>
                  <td style={{ padding: 10, display: 'flex', gap: 8 }}>
                    <button onClick={() => act(k._id, 'approve')} disabled={k.status !== 'pending'}>Approve</button>
                    <button onClick={() => act(k._id, 'reject')} disabled={k.status !== 'pending'}>Reject</button>
                  </td>
                </tr>
                {expandedId === k._id && (
                  <tr>
                    <td colSpan="8" style={{ background: '#fafbfc', padding: 12, borderBottom: '1px solid #e9ecef' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                        <div><strong>Full Name:</strong><div>{k.fullName || '-'}</div></div>
                        <div><strong>Date of Birth:</strong><div>{k.dateOfBirth ? new Date(k.dateOfBirth).toLocaleDateString() : '-'}</div></div>
                        <div><strong>Nationality:</strong><div>{k.nationality || '-'}</div></div>
                        <div><strong>Passport ID:</strong><div>{k.passportId || '-'}</div></div>
                        <div><strong>Country:</strong><div>{k.country || '-'}</div></div>
                        <div><strong>Address:</strong><div>{k.address || '-'}</div></div>
                        <div><strong>City:</strong><div>{k.city || '-'}</div></div>
                        <div><strong>Postal Code:</strong><div>{k.postalCode || '-'}</div></div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;


