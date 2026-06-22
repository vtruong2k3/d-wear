import { Steps } from "antd";
import { ClockCircleOutlined, EditOutlined, TruckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { IOrder } from "../../../types/order/IOrder";

interface OrderStatusTimelineProps {
  status: IOrder["status"];
}

const OrderStatusTimeline = ({ status }: OrderStatusTimelineProps) => {
  const getStatusStep = (status: IOrder["status"]) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    return steps.indexOf(status);
  };

  if (status === 'cancelled') return null;

  return (
    <Steps
      current={getStatusStep(status)}
      status={status === 'delivered' ? 'finish' : 'process'}
      items={[
        {
          title: 'Chờ xử lý',
          icon: <ClockCircleOutlined />,
        },
        {
          title: 'Đang xử lý',
          icon: <EditOutlined />,
        },
        {
          title: 'Đang giao hàng',
          icon: <TruckOutlined />,
        },
        {
          title: 'Đã giao thành công',
          icon: <CheckCircleOutlined />,
        },
      ]}
      style={{ padding: '0 24px', marginBottom: 24 }}
    />
  );
};

export default OrderStatusTimeline;
