import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Eye, Trash2, CheckCircle, Clock, XCircle, Loader } from "lucide-react";
import { initScrollAnimations, AnimatedSection } from "../utils/animations.jsx";

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [diocesanAccounts, setDiocesan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingDiocesan, setEditingDiocesan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('registrations');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const getToken = () => localStorage.getItem("admin_token");
  const getAdminInfo = () => {
    const info = localStorage.getItem("admin_info");
    return info ? JSON.parse(info) : null;
  };

  useEffect(() => {
    // Check if admin is logged in
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }

    fetchSubmissions();
    fetchPayments();
    fetchDiocesan();
  }, []);

  useEffect(() => {
    initScrollAnimations();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/submissions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_info");
          navigate("/admin/login");
          return;
        }
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_URL}/payment/all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_info");
          navigate("/admin/login");
          return;
        }
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      setPayments(data.data || []);
    } catch (err) {
      console.error("Fetch payments error:", err);
    }
  };

  const fetchDiocesan = async () => {
    try {
      const response = await fetch(`${API_URL}/diocesan/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch diocesan accounts");
        return;
      }

      const data = await response.json();
      setDiocesan(data.data || []);
    } catch (err) {
      console.error("Fetch diocesan error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    navigate("/admin/login");
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/submissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      setSubmissions(
        submissions.map((sub) =>
          sub._id === id ? { ...sub, status: newStatus } : sub
        )
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete submission");

      setSubmissions(submissions.filter((sub) => sub._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error deleting submission: " + err.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-green-800 animate-spin" />
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                Welcome, {getAdminInfo()?.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatedSection animation="animate-on-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('registrations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registrations'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registrations ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payments ({payments.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'registrations' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Total Submissions
              </p>
              <p className="text-4xl font-bold text-gray-800 mt-2">
                {submissions.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Pending
              </p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {submissions.filter((s) => s.status === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Approved
              </p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {submissions.filter((s) => s.status === "approved").length}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Total Payments
              </p>
              <p className="text-4xl font-bold text-gray-800 mt-2">
                {payments.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Total Revenue
              </p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                ${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm uppercase tracking-wide">
                Completed Payments
              </p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {payments.filter((p) => p.status === "completed").length}
              </p>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'registrations' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                All Registrations ({submissions.length})
              </h2>
            </div>

            {submissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">No submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Denary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{submission.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{submission.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{submission.denary}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <span className={`text-xs font-semibold uppercase ${
                              submission.status === "approved"
                                ? "text-green-600"
                                : submission.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}>
                              {submission.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(submission.submittedAt)}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(submission._id)}
                            className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">All Payments ({payments.length})</h2>
            </div>

            {payments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">No payments yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{payment.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.email}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">${payment.amount?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{payment.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.paidAt)}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      {/* View Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Registration Details
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">Name</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSubmission.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">Email</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSubmission.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSubmission.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">Denary</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSubmission.denary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">Parish</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSubmission.parish}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">Occupation</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSubmission.occupation}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm uppercase">Address</p>
                <p className="font-semibold text-gray-800">
                  {selectedSubmission.address}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm uppercase">Status</p>
                <div className="flex gap-2 mt-2">
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(selectedSubmission._id, status)
                      }
                      className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                        selectedSubmission.status === status
                          ? status === "approved"
                            ? "bg-green-600 text-white"
                            : status === "rejected"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm uppercase">Submitted</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedSubmission.submittedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Payment Details
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">Name</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayment.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">Email</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayment.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">Amount</p>
                  <p className="font-semibold text-green-600">
                    ${selectedPayment.amount?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">Payment Method</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {selectedPayment.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">Status</p>
                  <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                    selectedPayment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">Transaction ID</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedPayment.transactionId}
                  </p>
                </div>
              </div>

              {selectedPayment.cardLastFour && (
                <div>
                  <p className="text-gray-600 text-sm uppercase">Card Used</p>
                  <p className="font-semibold text-gray-800">
                    **** **** **** {selectedPayment.cardLastFour}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-600 text-sm uppercase">Paid At</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedPayment.paidAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                Delete Submission
              </h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-600">
                Are you sure you want to delete this submission? This action
                cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-4 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AdminDashboard;
