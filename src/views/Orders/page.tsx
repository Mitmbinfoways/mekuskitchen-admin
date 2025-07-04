import React, { useEffect, useState, Fragment } from 'react';
import { getAllOrders } from 'src/AxiosConfig/AxiosConfig';
import user1 from '/src/assets/images/profile/user-1.jpg';
import dayjs from 'dayjs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Button, TextInput } from 'flowbite-react';

interface Combination {
  [key: string]: string;
}

interface SKU {
  skuName?: string;
  color?: string;
  images?: string[];
}

interface ProductDetails {
  name: string;
  images: { url: string }[];
}

interface CartItem {
  sku?: SKU;
  productDetails: ProductDetails;
  combination?: Combination;
  quantity: number;
  price: number;
  name: string;
}

interface Order {
  _id: string;
  user: string;
  userImg: string;
  orderId: string;
  Orderdate: string;
  orderStatus: string;
  status: string;
  totalAmount: number;
  grandTotal: number;
  cartItems: CartItem[];
}

interface OrdersResponse {
  orders: Order[];
}

const Page: React.FC = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [data, setData] = useState<OrdersResponse>({ orders: [] });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const fetchOrders = async (filters: { startDate?: string; endDate?: string } = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      queryParams.append('page', '1');
      queryParams.append('limit', '20');

      const res = await getAllOrders();
      setData(res.data.data as OrdersResponse);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchOrders({ startDate: startDate || undefined, endDate: endDate || undefined });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Orders</h1>

      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col lg:flex-row items-end flex-wrap gap-4 mb-6 justify-between"
      >
        <div className="w-full lg:w-1/4">
          <TextInput placeholder="Search" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full lg:w-2/3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Button type="submit" color="primary" className="w-full sm:w-auto">
              Filter
            </Button>
            <Button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                fetchOrders();
              }}
              color="gray"
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800 border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 text-blue-800">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">User</th>
              <th className="px-4 py-3 whitespace-nowrap">Order ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Total</th>
              <th className="px-4 py-3 text-right whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              return (
                <Fragment key={order._id}>
                  <tr
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <td className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                      <img
                        src={user1}
                        alt={order.user}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded object-cover"
                      />
                      <span className="text-sm font-medium break-words">{order.user}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{order.orderId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {dayjs(order.Orderdate).format('DD MMM YYYY, hh:mm A')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">₹{order.grandTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={6} className="p-0 border-0">
                      <div
                        style={{
                          maxHeight: isExpanded ? '1000px' : '0px',
                          overflow: 'hidden',
                          transition: 'max-height 0.35s ease',
                        }}
                      >
                        {isExpanded && (
                          <div className="bg-white px-4 py-3 border border-t-0 border-gray-200 overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-700">
                              <thead className="text-blue-800 text-xs uppercase">
                                <tr>
                                  <th className="px-3 py-2 whitespace-nowrap">Image</th>
                                  <th className="px-3 py-2 whitespace-nowrap">Item</th>
                                  <th className="px-3 py-2 whitespace-nowrap">Color</th>
                                  <th className="px-3 py-2 whitespace-nowrap">SKU</th>
                                  <th className="px-3 py-2 whitespace-nowrap">Quantity</th>
                                  <th className="px-3 py-2 whitespace-nowrap">Price</th>
                                  <th className="px-3 py-2 whitespace-nowrap">Total Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.cartItems.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      <img
                                        src={
                                          item.sku?.images?.[0] ||
                                          item.productDetails.images[0]?.url ||
                                          item.productDetails.images[1]?.url ||
                                          ''
                                        }
                                        alt={item.productDetails.name}
                                        className="w-12 h-12 object-cover"
                                      />
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {item.sku?.skuName || item.productDetails.name}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {item.sku?.color || '-'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {item.combination ? (
                                        Object.entries(item.combination).map(
                                          ([key, value]) =>
                                            key.toLowerCase() !== 'stock' && (
                                              <div key={key}>
                                                <span className="font-medium capitalize">
                                                  {key}
                                                </span>
                                                : {value}
                                              </div>
                                            ),
                                        )
                                      ) : (
                                        <div>-</div>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.quantity}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      ₹{item.price.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      ₹{(item.quantity * item.price).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
