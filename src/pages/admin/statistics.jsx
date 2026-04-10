import { useCallback, useEffect, useState } from 'react';
import { RiBarChartLine, RiArrowUpSLine, RiArrowDownSLine, RiUserAddLine, RiStarLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import UserService from '../../services/user_service';
import useFormatPrice from '../../hooks/use_formatPrice';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   Title,
   Tooltip,
   Legend,
   Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const Statistics = () => {
   const { formatPrice } = useFormatPrice();
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState(null);
   const [revenueChartData, setRevenueChartData] = useState(null);
   const [filterType, setFilterType] = useState('month'); // 'day', 'month', 'year'

   const fetchStats = useCallback(
      async (type = filterType) => {
         setLoading(true);
         try {
            const res = await UserService.getDetailedStats({ type });
            if (res && res.EC === '0') {
               setStats(res.DT);
               prepareCharts(res.DT);
            } else {
               toast.error(res.EM || 'Không thể tải dữ liệu thống kê');
            }
         } catch (error) {
            console.error('Error fetching statistics:', error);
            toast.error('Có lỗi xảy ra khi kết nối máy chủ');
         } finally {
            setLoading(false);
         }
      },
      [filterType],
   );

   const prepareCharts = (data) => {
      if (!data || !data.revenueStats) return;

      const labels = data.revenueStats.map((item) => {
         if (data.type === 'day') return `${item.day}/${item.month}/${item.year}`;
         if (data.type === 'year') return `${item.year}`;
         return `T${item.month}/${item.year}`;
      });

      const revenue = data.revenueStats.map((item) => item.revenue);

      setRevenueChartData({
         labels,
         datasets: [
            {
               label: 'Doanh thu (VNĐ)',
               data: revenue,
               backgroundColor: 'rgba(59, 130, 246, 0.8)',
               borderColor: 'rgb(59, 130, 246)',
               borderWidth: 1,
               borderRadius: 6,
               hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
            },
         ],
      });
   };

   useEffect(() => {
      fetchStats();
   }, [fetchStats]);

   const handleFilterChange = (type) => {
      setFilterType(type);
      fetchStats(type);
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <RiBarChartLine className="text-blue-600" /> Thống kê chi tiết
               </h1>
               <p className="text-gray-500 text-sm">Phân tích chuyên sâu về tình hình kinh doanh</p>
            </div>
            <button
               onClick={() => fetchStats()}
               className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
               Làm mới dữ liệu
            </button>
         </div>

         {/* Global Performance Header */}
         <div className="bg-gradient-to-r from-emerald-600 to-teal-700 h-32 rounded-2xl relative overflow-hidden shadow-lg mb-4">
            <div className="absolute inset-0 opacity-10">
               <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
               </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-8">
               <div>
                  <h2 className="text-emerald-50 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Tổng doanh thu hệ thống</h2>
                  <div className="text-4xl font-black text-white">{formatPrice(stats?.totalOverallRevenue || 0)}</div>
               </div>
               <div className="flex gap-8">
                  <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                     <div className="text-emerald-50 text-[10px] uppercase font-bold mb-1 opacity-70 text-right">Tổng đơn hàng</div>
                     <div className="text-white font-black text-xl text-right">{stats?.totalCompletedOrders || 0}</div>
                  </div>
                  <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                     <div className="text-emerald-50 text-[10px] uppercase font-bold mb-1 opacity-70 text-right">Giá trị TB đơn (AOV)</div>
                     <div className="text-white font-black text-xl text-right">
                        {formatPrice(
                           stats?.totalOverallRevenue && stats?.totalCompletedOrders
                              ? stats.totalOverallRevenue / stats.totalCompletedOrders
                              : 0,
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Filter Section (Moved below Global Stats) */}
         <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">Bộ lọc phân tích định kỳ:</span>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
               <button
                  onClick={() => handleFilterChange('day')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                     filterType === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
               >
                  Theo Ngày
               </button>
               <button
                  onClick={() => handleFilterChange('month')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                     filterType === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
               >
                  Theo Tháng
               </button>
               <button
                  onClick={() => handleFilterChange('year')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                     filterType === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
               >
                  Theo Năm
               </button>
            </div>
         </div>

         {/* Periodic Metrics Section */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <RiUserAddLine size={24} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Người dùng mới</span>
               </div>
               <div className="text-3xl font-bold text-gray-900">{stats?.newUsersThisMonth}</div>
               <div className="text-xs text-gray-500 mt-1">Trong tháng {new Date().getMonth() + 1}</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 text-yellow-500 mb-2">
                  <RiStarLine size={24} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Đánh giá trung bình</span>
               </div>
               <div className="text-3xl font-bold text-gray-900">
                  {stats?.feedbackStats?.avgRating ? parseFloat(stats.feedbackStats.avgRating).toFixed(1) : '0.0'}
               </div>
               <div className="text-xs text-gray-500 mt-1">Dựa trên {stats?.feedbackStats?.totalFeedback} nhận xét</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 text-green-600 mb-2">
                  <RiBarChartLine size={24} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Tăng trưởng</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-gray-900">
                     {stats?.revenueStats?.length > 1
                        ? (
                             ((stats.revenueStats[stats.revenueStats.length - 1].revenue -
                                stats.revenueStats[stats.revenueStats.length - 2].revenue) /
                                (stats.revenueStats[stats.revenueStats.length - 2].revenue || 1)) *
                             100
                          ).toFixed(1)
                        : '0.0'}
                     %
                  </div>
                  {stats?.revenueStats?.length > 1 &&
                  stats.revenueStats[stats.revenueStats.length - 1].revenue >=
                     stats.revenueStats[stats.revenueStats.length - 2].revenue ? (
                     <RiArrowUpSLine className="text-green-500" size={24} />
                  ) : (
                     <RiArrowDownSLine className="text-red-500" size={24} />
                  )}
               </div>
               <div className="text-xs text-gray-500 mt-1">So với tháng trước</div>
            </div>
         </div>

         {/* Main Charts */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight">
               Biểu đồ doanh thu {filterType === 'day' ? '30 ngày' : filterType === 'year' ? '5 năm' : '12 tháng'}
            </h2>
            <div className="h-[400px]">
               {revenueChartData && (
                  <Bar
                     data={revenueChartData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                           legend: {
                              display: false,
                           },
                           tooltip: {
                              callbacks: {
                                 label: (context) => `Doanh thu: ${formatPrice(context.raw)}`,
                              },
                           },
                        },
                        scales: {
                           y: {
                              beginAtZero: true,
                              ticks: {
                                 callback: (value) => formatPrice(value),
                              },
                           },
                        },
                     }}
                  />
               )}
            </div>
         </div>

         {/* Feedback Trends */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <h2 className="text-lg font-bold text-green-700 mb-4">Chi tiết sản phẩm bán chạy</h2>
               <div className="space-y-4">
                  {stats?.topRated?.map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <span className="text-green-600 font-bold">#{i + 1}</span>
                           <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                              {item.Product?.name}
                           </span>
                        </div>
                        <div className="flex items-center gap-1">
                           <span className="text-sm font-bold text-gray-900">
                              {parseFloat(item.avgRating).toFixed(1)}
                           </span>
                           <span className="text-yellow-400">★</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
               <h2 className="text-lg font-bold text-red-700 mb-4">Sản phẩm cần cải thiện</h2>
               <div className="space-y-4">
                  {stats?.bottomRated?.map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <span className="text-red-600 font-bold">#{i + 1}</span>
                           <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                              {item.Product?.name}
                           </span>
                        </div>
                        <div className="flex items-center gap-1">
                           <span className="text-sm font-bold text-gray-900">
                              {parseFloat(item.avgRating).toFixed(1)}
                           </span>
                           <span className="text-red-400">★</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sales Detail Table */}
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Chi tiết doanh số bán hàng</h2>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs">
                     <tr>
                        <th className="py-3 px-4">Sản phẩm</th>
                        <th className="py-3 px-4 text-center">Số lượng đã bán</th>
                        <th className="py-3 px-4 text-right">Tổng doanh thu</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {stats?.productSales?.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                           <td className="py-4 px-4 font-medium text-gray-700">{item.Product?.name}</td>
                           <td className="py-4 px-4 text-center font-bold text-gray-900">{item.totalSold}</td>
                           <td className="py-4 px-4 text-right font-bold text-blue-600">{formatPrice(item.revenue)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default Statistics;
