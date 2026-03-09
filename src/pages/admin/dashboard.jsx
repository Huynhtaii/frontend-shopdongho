import { useCallback, useEffect, useMemo, useState } from 'react';
import { RiShoppingCart2Line, RiUserLine, RiProductHuntLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import OrderService from '../../services/order_service';
import CategoryService from '../../services/category_service';
import BrandService from '../../services/brand_service';
import useFormatPrice from '../../hooks/use_formatPrice';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   BarElement,
   ArcElement,
   Title,
   Tooltip,
   Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Đăng ký các components của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
   const [stats, setStats] = useState([
      {
         title: 'Tổng doanh thu',
         value: '0',
         icon: <RiMoneyDollarCircleLine size={24} />,
         color: 'bg-green-500',
         link: '/admin/orders', // Revenue often links to orders
      },
      {
         title: 'Đơn hàng',
         value: '0',
         icon: <RiShoppingCart2Line size={24} />,
         color: 'bg-blue-500',
         link: '/admin/orders',
      },
      {
         title: 'Sản phẩm',
         value: '0',
         icon: <RiProductHuntLine size={24} />,
         color: 'bg-yellow-500',
         link: '/admin/products',
      },
      {
         title: 'Khách hàng',
         value: '0',
         icon: <RiUserLine size={24} />,
         color: 'bg-purple-500',
         link: '/admin/users',
      },
   ]);
   const { formatPrice } = useFormatPrice();

   // State cho dữ liệu biểu đồ
   const [chartData, setChartData] = useState({
      revenueData: {
         labels: [],
         datasets: [],
      },
      orderStatusData: {
         labels: [],
         datasets: [],
      },
   });

   // State cho dữ liệu bổ sung
   const [topProducts, setTopProducts] = useState([]);
   const [recentOrders, setRecentOrders] = useState([]);
   const [pendingOrders, setPendingOrders] = useState([]);
   const [approvingId, setApprovingId] = useState(null);
   const [categoryChartData, setCategoryChartData] = useState(null);
   const [brandChartData, setBrandChartData] = useState(null);

   const updateStats = useCallback(
      (stats) => {
         setStats((prev) =>
            prev.map((stat) => {
               switch (stat.title) {
                  case 'Tổng doanh thu':
                     return { ...stat, value: formatPrice(stats.totalRevenue) };
                  case 'Đơn hàng':
                     return { ...stat, value: stats.totalOrders.toLocaleString() };
                  case 'Sản phẩm':
                     return { ...stat, value: stats.totalProducts.toLocaleString() };
                  case 'Khách hàng':
                     return { ...stat, value: stats.totalCustomers.toLocaleString() };
                  default:
                     return stat;
               }
            }),
         );
      },
      [formatPrice],
   );

   const fetchOrders = useCallback(async () => {
      try {
         const response = await OrderService.getAllOrders();
         if (response.EC === '0') {
            const orders = response.DT.orders;
            updateStats(response.DT.stats);
            prepareChartData(orders);
            calculateTopProducts(orders);
            setRecentOrders(orders.slice(0, 5));
            setPendingOrders(orders.filter((o) => o.status === 'Pending'));
         }
      } catch (error) {
         console.error('Error fetching orders:', error);
      }
   }, [updateStats]);

   const handleQuickAction = async (orderId, action) => {
      setApprovingId(orderId);
      try {
         const newStatus = action === 'approve' ? 'Shipped' : 'Canceled';
         const res = await OrderService.updateOrderStatus(orderId, newStatus);
         if (res && res.EC === '0') {
            if (action === 'approve') {
               toast.success(`Đã duyệt đơn #${orderId} — chuyển sang Đang giao!`);
            } else {
               toast.info(`Đã huỷ đơn #${orderId}.`);
            }
            fetchOrders();
         } else {
            toast.error('Cập nhật thất bại, vui lòng thử lại.');
         }
      } catch (error) {
         console.error('Error updating order:', error);
         toast.error('Có lỗi xảy ra, vui lòng thử lại.');
      } finally {
         setApprovingId(null);
      }
   };

   const CHART_COLORS = useMemo(
      () => [
         '#6366f1',
         '#f59e0b',
         '#10b981',
         '#3b82f6',
         '#ec4899',
         '#8b5cf6',
         '#14b8a6',
         '#f97316',
         '#ef4444',
         '#84cc16',
      ],
      [],
   );

   const fetchCategoryAndBrandStats = useCallback(async () => {
      try {
         const [catRes, brandRes] = await Promise.all([CategoryService.getAll(), BrandService.getAll()]);
         if (catRes && catRes.EC === '0') {
            const cats = catRes.DT.filter((c) => (c.Products?.length ?? 0) > 0);
            setCategoryChartData({
               labels: cats.map((c) => c.name),
               datasets: [
                  {
                     data: cats.map((c) => c.Products?.length ?? 0),
                     backgroundColor: CHART_COLORS.slice(0, cats.length),
                     borderWidth: 2,
                     borderColor: '#fff',
                     hoverOffset: 10,
                  },
               ],
            });
         }
         if (brandRes && brandRes.EC === '0') {
            const brands = brandRes.DT.filter((b) => (b.products?.length ?? 0) > 0);
            setBrandChartData({
               labels: brands.map((b) => b.name),
               datasets: [
                  {
                     data: brands.map((b) => b.products?.length ?? 0),
                     backgroundColor: [...CHART_COLORS].reverse().slice(0, brands.length),
                     borderWidth: 2,
                     borderColor: '#fff',
                     hoverOffset: 10,
                  },
               ],
            });
         }
      } catch (error) {
         console.error('Error fetching category/brand stats:', error);
      }
   }, [CHART_COLORS]);

   useEffect(() => {
      fetchOrders();
      fetchCategoryAndBrandStats();
   }, [fetchOrders, fetchCategoryAndBrandStats]);

   const calculateTopProducts = (orders) => {
      const productSales = {};
      orders.forEach((order) => {
         order.order_items?.forEach((item) => {
            const id = item.product_id;
            if (!productSales[id]) {
               productSales[id] = {
                  id: id,
                  name: item.Product?.name || 'Sản phẩm không xác định',
                  totalSold: 0,
                  revenue: 0,
                  image: item.Product?.ProductImages?.[0]?.url,
               };
            }
            productSales[id].totalSold += item.quantity;
            productSales[id].revenue += item.quantity * item.price;
         });
      });

      const top = Object.values(productSales)
         .sort((a, b) => b.totalSold - a.totalSold)
         .slice(0, 5);
      setTopProducts(top);
   };

   const prepareChartData = (orders) => {
      const revenueByDate = {};
      const statusCount = {
         Pending: 0,
         Shipped: 0,
         Completed: 0,
         Canceled: 0,
      };

      orders.forEach((order) => {
         // Xử lý dữ liệu doanh thu theo ngày (YYYY-MM-DD để dễ sort)
         const dateObj = new Date(order.order_date);
         const dateStr = dateObj.toISOString().split('T')[0];
         revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + parseFloat(order.total_amount);

         statusCount[order.status] = (statusCount[order.status] || 0) + 1;
      });

      // Sort dates chronologically
      const sortedDates = Object.keys(revenueByDate).sort();
      const formattedLabels = sortedDates.map((date) => new Date(date).toLocaleDateString('vi-VN'));

      setChartData({
         revenueData: {
            labels: formattedLabels,
            datasets: [
               {
                  fill: true,
                  label: 'Doanh thu',
                  data: sortedDates.map((date) => revenueByDate[date]),
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: 'white',
                  pointBorderColor: 'rgb(59, 130, 246)',
                  pointHoverRadius: 6,
               },
            ],
         },
         orderStatusData: {
            labels: ['Pending', 'Shipped', 'Completed', 'Canceled'],
            datasets: [
               {
                  label: 'Số đơn hàng',
                  data: [statusCount.Pending, statusCount.Shipped, statusCount.Completed, statusCount.Canceled],
                  backgroundColor: [
                     '#fbbf24', // Pending - Amber
                     '#3b82f6', // Shipped - Blue
                     '#10b981', // Completed - Emerald
                     '#ef4444', // Canceled - Red
                  ],
                  borderRadius: 6,
               },
            ],
         },
      });
   };

   const getStatusClass = (status) => {
      switch (status.toLowerCase()) {
         case 'completed':
            return 'bg-green-100 text-green-700';
         case 'pending':
            return 'bg-yellow-100 text-yellow-700';
         case 'shipped':
            return 'bg-blue-100 text-blue-700';
         default:
            return 'bg-red-100 text-red-700';
      }
   };

   return (
      <div className="space-y-8 bg-gray-50/50 -m-6 p-6 min-h-screen">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tổng quan kinh doanh</h1>
            <div className="text-sm text-gray-500">Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}</div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
               <Link
                  key={index}
                  to={stat.link}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
               >
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                     </div>
                     <div className={`${stat.color} p-3 rounded-2xl text-white shadow-sm ring-4 ring-gray-50`}>
                        {stat.icon}
                     </div>
                  </div>
               </Link>
            ))}
         </div>

         {/* Charts Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Xu hướng doanh thu</h2>
                  <select className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2 py-1 outline-none">
                     <option>7 ngày qua</option>
                  </select>
               </div>
               <div className="h-[300px]">
                  <Line
                     data={chartData.revenueData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                           x: { grid: { display: false } },
                           y: {
                              beginAtZero: true,
                              ticks: { callback: (v) => formatPrice(v), maxTicksLimit: 5 },
                           },
                        },
                     }}
                  />
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h2 className="text-lg font-bold text-gray-800 mb-6">Trạng thái đơn hàng</h2>
               <div className="h-[300px]">
                  <Bar
                     data={chartData.orderStatusData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                           x: { grid: { display: false } },
                           y: { beginAtZero: true, ticks: { stepSize: 1 } },
                        },
                     }}
                  />
               </div>
            </div>
         </div>

         {/* Pending Orders Quick Review */}
         {pendingOrders.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                     </span>
                     <h2 className="text-lg font-bold text-gray-800">Duyệt nhanh đơn hàng</h2>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                     {pendingOrders.length} đang chờ
                  </span>
               </div>
               <div className="relative overflow-x-auto">
                  {/* Loading overlay — chặn tương tác khi đang xử lý */}
                  {approvingId && (
                     <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                        <div className="flex items-center gap-3 bg-white shadow-lg rounded-xl px-5 py-3 border border-amber-100">
                           <span className="w-5 h-5 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                           <span className="text-sm font-semibold text-gray-600">Đang xử lý...</span>
                        </div>
                     </div>
                  )}
                  <table className="w-full text-left text-sm">
                     <thead>
                        <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                           <th className="pb-3 px-2">ID</th>
                           <th className="pb-3 px-2">Khách hàng</th>
                           <th className="pb-3 px-2">Ngày đặt</th>
                           <th className="pb-3 px-2">Sản phẩm</th>
                           <th className="pb-3 px-2 text-right">Tổng tiền</th>
                           <th className="pb-3 px-2 text-center">Thao tác</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {pendingOrders.map((order) => (
                           <tr key={order.order_id} className="hover:bg-amber-50/50 transition-colors">
                              <td className="py-3 px-2 font-bold text-blue-600">#{order.order_id}</td>
                              <td className="py-3 px-2 font-medium text-gray-700">
                                 {order.User?.name || `ID: ${order.user_id}`}
                              </td>
                              <td className="py-3 px-2 text-gray-500">
                                 {new Date(order.order_date).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="py-3 px-2 text-gray-500 max-w-[200px]">
                                 <span className="truncate block">
                                    {order.order_items
                                       ?.map((i) => i.Product?.name)
                                       .filter(Boolean)
                                       .join(', ') || '—'}
                                 </span>
                              </td>
                              <td className="py-3 px-2 font-bold text-gray-900 text-right">
                                 {formatPrice(order.total_amount)}
                              </td>
                              <td className="py-3 px-2">
                                 <div className="flex items-center justify-center gap-2">
                                    <button
                                       onClick={() => handleQuickAction(order.order_id, 'approve')}
                                       disabled={approvingId === order.order_id}
                                       className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                       {approvingId === order.order_id ? (
                                          <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                       ) : (
                                          '✓'
                                       )}{' '}
                                       Duyệt
                                    </button>
                                    <button
                                       onClick={() => handleQuickAction(order.order_id, 'cancel')}
                                       disabled={approvingId === order.order_id}
                                       className="flex items-center gap-1 bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                       ✕ Huỷ
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Bottom Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h2 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm bán chạy</h2>
               <div className="space-y-4">
                  {topProducts.map((p) => (
                     <div key={p.id} className="flex items-center gap-4">
                        <img
                           src={p.image}
                           alt=""
                           className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                           <p className="text-xs text-gray-500">
                              Đã bán: <span className="font-bold text-gray-700">{p.totalSold}</span>
                           </p>
                        </div>
                        <div className="text-sm font-bold text-blue-600">{formatPrice(p.revenue)}</div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
               <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng mới nhất</h2>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead>
                        <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-50">
                           <th className="pb-3 px-2">ID</th>
                           <th className="pb-3 px-2">Khách hàng</th>
                           <th className="pb-3 px-2">Ngày</th>
                           <th className="pb-3 px-2">Tổng</th>
                           <th className="pb-3 px-2">Trạng thái</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {recentOrders.map((order) => (
                           <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-2 font-bold text-blue-600">#{order.order_id}</td>
                              <td className="py-4 px-2 font-medium text-gray-700">
                                 {order.User?.name || `ID: ${order.user_id}`}
                              </td>
                              <td className="py-4 px-2 text-gray-500">
                                 {new Date(order.order_date).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="py-4 px-2 font-bold text-gray-900">{formatPrice(order.total_amount)}</td>
                              <td className="py-4 px-2">
                                 <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClass(order.status)}`}
                                 >
                                    {order.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Category & Brand Stats */}
         {(categoryChartData || brandChartData) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Category Doughnut */}
               {categoryChartData && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                     <h2 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm theo danh mục</h2>
                     <div className="flex items-center gap-6">
                        <div className="w-[180px] h-[180px] shrink-0">
                           <Doughnut
                              data={categoryChartData}
                              options={{
                                 responsive: true,
                                 maintainAspectRatio: false,
                                 cutout: '65%',
                                 plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                       callbacks: {
                                          label: (ctx) => ` ${ctx.label}: ${ctx.raw} sản phẩm`,
                                       },
                                    },
                                 },
                              }}
                           />
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                           {categoryChartData.labels.map((label, i) => (
                              <div key={i} className="flex items-center justify-between gap-2">
                                 <div className="flex items-center gap-2 min-w-0">
                                    <span
                                       className="w-2.5 h-2.5 rounded-full shrink-0"
                                       style={{ backgroundColor: categoryChartData.datasets[0].backgroundColor[i] }}
                                    />
                                    <span className="text-xs text-gray-600 truncate">{label}</span>
                                 </div>
                                 <span className="text-xs font-bold text-gray-800 shrink-0">
                                    {categoryChartData.datasets[0].data[i]}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* Brand Doughnut */}
               {brandChartData && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                     <h2 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm theo thương hiệu</h2>
                     <div className="flex items-center gap-6">
                        <div className="w-[180px] h-[180px] shrink-0">
                           <Doughnut
                              data={brandChartData}
                              options={{
                                 responsive: true,
                                 maintainAspectRatio: false,
                                 cutout: '65%',
                                 plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                       callbacks: {
                                          label: (ctx) => ` ${ctx.label}: ${ctx.raw} sản phẩm`,
                                       },
                                    },
                                 },
                              }}
                           />
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                           {brandChartData.labels.map((label, i) => (
                              <div key={i} className="flex items-center justify-between gap-2">
                                 <div className="flex items-center gap-2 min-w-0">
                                    <span
                                       className="w-2.5 h-2.5 rounded-full shrink-0"
                                       style={{ backgroundColor: brandChartData.datasets[0].backgroundColor[i] }}
                                    />
                                    <span className="text-xs text-gray-600 truncate">{label}</span>
                                 </div>
                                 <span className="text-xs font-bold text-gray-800 shrink-0">
                                    {brandChartData.datasets[0].data[i]}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default Dashboard;
