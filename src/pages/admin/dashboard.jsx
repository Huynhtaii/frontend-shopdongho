import {
  RiShoppingCart2Line,
  RiUserLine,
  RiProductHuntLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

const Dashboard = () => {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "120.5M",
      icon: <RiMoneyDollarCircleLine size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Đơn hàng",
      value: "250",
      icon: <RiShoppingCart2Line size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Sản phẩm",
      value: "1,250",
      icon: <RiProductHuntLine size={24} />,
      color: "bg-yellow-500",
    },
    {
      title: "Khách hàng",
      value: "820",
      icon: <RiUserLine size={24} />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h2>
          {/* Add your orders table here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
