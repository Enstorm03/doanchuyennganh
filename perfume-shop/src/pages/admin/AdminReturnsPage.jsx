import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingReturns();
  }, []);

  const fetchPendingReturns = async () => {
    try {
      setLoading(true);
      const returnsData = await api.getPendingReturns();
      setReturns(returnsData || []);
    } catch (err) {
      console.error('Error fetching returns:', err);
      setError('Không thể tải danh sách đổi trả');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async (returnId) => {
    if (!window.confirm('Bạn có chắc muốn duyệt phiếu đổi trả này? Hệ thống sẽ hoàn kho tất cả sản phẩm.')) {
      return;
    }

    try {
      setProcessing(returnId);
      await api.approveReturn(returnId, 1); // Using employee ID 1 for now
      alert('Đã duyệt phiếu đổi trả thành công!');
      await fetchPendingReturns(); // Refresh the list
    } catch (error) {
      alert('Không thể duyệt phiếu đổi trả: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectReturn = async (returnId) => {
    const reason = prompt('Lý do từ chối:');
    if (!reason || reason.trim() === '') {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessing(returnId);
      await api.rejectReturn(returnId, 1); // Using employee ID 1 for now
      alert('Đã từ chối phiếu đổi trả!');
      await fetchPendingReturns(); // Refresh the list
    } catch (error) {
      alert('Không thể từ chối phiếu đổi trả: ' + error.message);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ duyệt': return 'text-yellow-600';
      case 'Đã duyệt': return 'text-green-600';
      case 'Từ chối': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Chờ duyệt': return 'bg-yellow-100 text-yellow-800';
      case 'Đã duyệt': return 'bg-green-100 text-green-800';
      case 'Từ chối': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPendingReturns}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Quản lý đổi trả</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Duyệt và xử lý các yêu cầu đổi trả từ khách hàng
          </p>
        </div>
        <button
          onClick={fetchPendingReturns}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined mr-2">refresh</span>
          Làm mới
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Chờ duyệt</h3>
            <span className="material-symbols-outlined text-yellow-600">schedule</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-yellow-600">
              {returns.filter(r => r.trangThai === 'Chờ duyệt').length}
            </div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              Phiếu cần xử lý
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Đã duyệt</h3>
            <span className="material-symbols-outlined text-green-600">check_circle</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-green-600">
              {returns.filter(r => r.trangThai === 'Đã duyệt').length}
            </div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              Hoàn thành hôm nay
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-subtle-light dark:text-text-subtle-dark">Từ chối</h3>
            <span className="material-symbols-outlined text-red-600">cancel</span>
          </div>
          <div className="pt-0">
            <div className="text-2xl font-bold text-red-600">
              {returns.filter(r => r.trangThai === 'Từ chối').length}
            </div>
            <p className="text-xs text-text-subtle-light dark:text-text-subtle-dark pt-1">
              Không đủ điều kiện
            </p>
          </div>
        </div>
      </div>

      {/* Returns List */}
      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Danh sách phiếu đổi trả</h3>

          {returns.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">assignment_return</span>
              <p className="text-gray-500 dark:text-gray-400">Không có phiếu đổi trả nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returns.map((returnItem) => (
                <div key={returnItem.idDoiTra} className="border border-border-light dark:border-border-dark rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">Phiếu #{returnItem.idDoiTra}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(returnItem.trangThai)}`}>
                          {returnItem.trangThai}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p><strong>Đơn hàng:</strong> #{returnItem.idDonHang}</p>
                        <p><strong>Khách hàng:</strong> ID {returnItem.idNguoiDung}</p>
                        <p><strong>Lý do:</strong> {returnItem.lyDo}</p>
                        <p><strong>Ngày tạo:</strong> {returnItem.ngayTao ? new Date(returnItem.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}</p>
                      </div>
                    </div>

                    {returnItem.trangThai === 'Chờ duyệt' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveReturn(returnItem.idDoiTra)}
                          disabled={processing === returnItem.idDoiTra}
                          className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          {processing === returnItem.idDoiTra ? 'Đang xử lý...' : 'Duyệt'}
                        </button>
                        <button
                          onClick={() => handleRejectReturn(returnItem.idDoiTra)}
                          disabled={processing === returnItem.idDoiTra}
                          className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          {processing === returnItem.idDoiTra ? 'Đang xử lý...' : 'Từ chối'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order details could be expanded here */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nhấp vào "Duyệt" để hoàn kho và xử lý đổi trả. Nhấp vào "Từ chối" nếu không đủ điều kiện.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReturnsPage;
