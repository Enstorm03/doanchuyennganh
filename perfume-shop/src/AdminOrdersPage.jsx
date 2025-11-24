import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const mockOrders = [
  {
    id: '#3210',
    customer: 'Nguyễn Văn A',
    date: '2024-07-28',
    total: '3,500,000đ',
    status: 'Hoàn thành',
  },
  {
    id: '#3209',
    customer: 'Trần Thị B',
    date: '2024-07-28',
    total: '2,800,000đ',
    status: 'Đang giao',
  },
  {
    id: '#3208',
    customer: 'Lê Văn C',
    date: '2024-07-27',
    total: '7,200,000đ',
    status: 'Đã hủy',
  },
  {
    id: '#3207',
    customer: 'Phạm Thị D',
    date: '2024-07-26',
    total: '4,100,000đ',
    status: 'Chờ xử lý',
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Đang giao':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Chờ xử lý':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Hiển thị 3 đơn hàng mỗi trang

  const filteredOrders = mockOrders
    .filter(order => {
      if (statusFilter === 'All') return true;
      return order.status === statusFilter;
    })
    .filter(order => {
      const term = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term)
      );
    });

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl text-text-light dark:text-text-dark">
          Quản Lý Đơn Hàng
        </h1>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
        <input
          type="text"
          placeholder="Tìm theo mã ĐH, tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full sm:flex-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select w-full sm:w-auto rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
          <option value="All">Tất cả trạng thái</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đang giao">Đang giao</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className="rounded-xl border bg-surface-light text-card-foreground shadow border-border-light dark:border-border-dark dark:bg-surface-dark">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b [&_tr]:border-border-light dark:[&_tr]:border-border-dark">
              <tr className="text-text-subtle-light dark:text-text-subtle-dark">
                <th className="h-12 px-4 text-left align-middle font-medium">Mã đơn hàng</th>
                <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Khách hàng</th>
                <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Ngày đặt</th>
                <th className="h-12 px-4 text-left align-middle font-medium hidden sm:table-cell">Trạng thái</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {currentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border-light dark:border-border-dark transition-colors hover:bg-background-light dark:hover:bg-background-dark">
                  <td className="p-4 align-middle font-medium">
                    <Link to={`/admin/orders/${order.id.replace('#', '')}`} className="text-primary hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="p-4 align-middle hidden md:table-cell text-text-light dark:text-text-dark">{order.customer}</td>
                  <td className="p-4 align-middle hidden md:table-cell text-text-subtle-light dark:text-text-subtle-dark">{order.date}</td>
                  <td className="p-4 align-middle hidden sm:table-cell">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right font-bold text-text-light dark:text-text-dark">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex justify-center mt-4">
          <ul className="inline-flex items-center -space-x-px text-sm">
            <li>
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button onClick={() => paginate(i + 1)} className={`px-3 h-8 border ${currentPage === i + 1 ? 'text-white bg-primary border-primary' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AdminOrdersPage;