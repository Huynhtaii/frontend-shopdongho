import { useEffect, useState } from 'react';
import { RiShoppingCart2Line, RiUserLine, RiProductHuntLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import OrderService from '../../services/order_service';
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Đăng ký các components của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
   const [orders, setOrders] = useState([]);
   const [stats, setStats] = useState([
      {
         title: 'Tổng doanh thu',
         value: '0',
         icon: <RiMoneyDollarCircleLine size={24} />,
         color: 'bg-green-500',
      },
      {
         title: 'Đơn hàng',
         value: '0',
         icon: <RiShoppingCart2Line size={24} />,
         color: 'bg-blue-500',
      },
      {
         title: 'Sản phẩm',
         value: '0',
         icon: <RiProductHuntLine size={24} />,
         color: 'bg-yellow-500',
      },
      {
         title: 'Khách hàng',
         value: '0',
         icon: <RiUserLine size={24} />,
         color: 'bg-purple-500',
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

   useEffect(() => {
      fetchOrders();
   }, []);

   const fetchOrders = async () => {
      try {
         const response = await OrderService.getAllOrders();
         if (response.EC === '0') {
            setOrders(response.DT.orders);
            updateStats(response.DT.stats);
            prepareChartData(response.DT.orders);
         }
      } catch (error) {
         console.error('Error fetching orders:', error);
      }
   };

   const prepareChartData = (orders) => {
      // Chuẩn bị dữ liệu cho biểu đồ doanh thu
      const revenueByDate = {};
      const statusCount = {
         Pending: 0,
         Shipped: 0,
         Completed: 0,
         Canceled: 0,
      };

      orders.forEach((order) => {
         // Xử lý dữ liệu doanh thu theo ngày
         const date = new Date(order.order_date).toLocaleDateString('vi-VN');
         revenueByDate[date] = (revenueByDate[date] || 0) + parseFloat(order.total_amount);

         // Đếm số lượng đơn hàng theo trạng thái
         statusCount[order.status] = (statusCount[order.status] || 0) + 1;
      });

      setChartData({
         revenueData: {
            labels: Object.keys(revenueByDate),
            datasets: [
               {
                  label: 'Doanh thu',
                  data: Object.values(revenueByDate),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
               },
            ],
         },
         orderStatusData: {
            labels: Object.keys(statusCount),
            datasets: [
               {
                  label: 'Số đơn hàng',
                  data: Object.values(statusCount),
                  backgroundColor: [
                     'rgba(255, 206, 86, 0.5)', // Pending - Yellow
                     'rgba(54, 162, 235, 0.5)', // Shipped - Blue
                     'rgba(75, 192, 192, 0.5)', // Completed - Green
                     'rgba(255, 99, 132, 0.5)', // Canceled - Red
                  ],
               },
            ],
         },
      });
   };

   const updateStats = (stats) => {
      setStats((prev) =>
         prev.map((stat) => {
            switch (stat.title) {
               case 'Tổng doanh thu':
                  return { ...stat, value: formatPrice(stats.totalRevenue) };
               case 'Đơn hàng':
                  return { ...stat, value: stats.totalOrders.toString() };
               case 'Sản phẩm':
                  return { ...stat, value: stats.totalProducts.toString() };
               case 'Khách hàng':
                  return { ...stat, value: stats.totalCustomers.toString() };
               default:
                  return stat;
            }
         }),
      );
   };

   const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
         case 'completed':
            return 'text-green-600';
         case 'pending':
            return 'text-yellow-600';
         case 'shipped':
            return 'text-blue-600';
         case 'canceled':
            return 'text-red-600';
         default:
            return 'text-gray-600';
      }
   };

   return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
               <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                     <div className={`${stat.color} p-3 rounded-lg text-white`}>{stat.icon}</div>
                     <div className="ml-4">
                        <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Biểu đồ doanh thu */}
            <div className="bg-white rounded-lg shadow p-6">
               <h2 className="text-xl font-semibold mb-4">Doanh thu theo ngày</h2>
               <div className="h-[300px]">
                  <Line
                     data={chartData.revenueData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
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
               </div>
            </div>

            {/* Biểu đồ trạng thái đơn hàng */}
            <div className="bg-white rounded-lg shadow p-6">
               <h2 className="text-xl font-semibold mb-4">Trạng thái đơn hàng</h2>
               <div className="h-[300px]">
                  <Bar
                     data={chartData.orderStatusData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                           y: {
                              beginAtZero: true,
                              ticks: {
                                 stepSize: 1,
                              },
                           },
                        },
                     }}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
