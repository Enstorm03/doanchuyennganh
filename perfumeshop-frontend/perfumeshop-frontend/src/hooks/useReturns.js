import { useState, useEffect } from 'react';
import api from '../services/api';

const useReturns = () => {
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

  // Calculate summary statistics
  const getPendingCount = () => returns.filter(r => r.trangThai === 'Chờ duyệt').length;
  const getApprovedCount = () => returns.filter(r => r.trangThai === 'Đã duyệt').length;
  const getRejectedCount = () => returns.filter(r => r.trangThai === 'Từ chối').length;

  return {
    returns,
    loading,
    error,
    processing,
    fetchPendingReturns,
    handleApproveReturn,
    handleRejectReturn,
    getPendingCount,
    getApprovedCount,
    getRejectedCount
  };
};

export default useReturns;
