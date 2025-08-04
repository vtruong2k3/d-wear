import React from "react";
import { Typography, Row, Col, Card, Divider, Space } from "antd";
import {
  SkinOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  UndoOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const AboutPage: React.FC = () => {
  return (
    <div style={{ padding: "48px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <Typography>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Giới Thiệu Về <span style={{ color: "#1890ff" }}>D-Wear</span>
        </Title>

        <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
          <Text strong>D-Wear</Text> là thương hiệu thời trang nam hướng đến
          phong cách <Text underline>đơn giản, hiện đại và tinh tế</Text>. Chúng
          tôi tin rằng quần áo không chỉ để mặc – mà còn là cách thể hiện cá
          tính và sự tự tin của người đàn ông hiện đại.
        </Paragraph>

        <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
          Thành lập từ năm 2025, D-Wear cam kết mang đến các sản phẩm{" "}
          <Text italic>chất lượng – vừa vặn – dễ phối</Text> cho nam giới trong
          nhiều hoàn cảnh: đi làm, dạo phố, gặp gỡ bạn bè hoặc hẹn hò.
        </Paragraph>

        <Divider />

        <Title level={3}>Sản phẩm chủ lực</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{ backgroundColor: "#fafafa", height: "100%" }}
            >
              <Space direction="vertical">
                <SkinOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                <Title level={4}>Áo nam</Title>
                <Paragraph>
                  Các dòng áo như:{" "}
                  <Text strong>Polo, T-Shirt, Áo sơ mi, Sơ mi ngắn tay</Text> –
                  chất liệu mát mẻ, form chuẩn, dễ phối đồ.
                </Paragraph>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{ backgroundColor: "#fafafa", height: "100%" }}
            >
              <Space direction="vertical">
                <ShoppingOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                <Title level={4}>Quần nam</Title>
                <Paragraph>
                  Bao gồm: <Text strong>Quần Âu, Quần Jean</Text> – kiểu dáng
                  thanh lịch, thoải mái, thích hợp cho cả đi làm và đi chơi.
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Title level={3}>Giá trị cốt lõi</Title>
        <ul style={{ fontSize: 16, lineHeight: 2 }}>
          <li>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Text strong>Chất lượng thật:</Text> Vải bền, form đẹp, đường may tỉ
            mỉ.
          </li>
          <li>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Text strong>Phục vụ tận tâm:</Text> Tư vấn tận tình, hỗ trợ đổi
            size.
          </li>
          <li>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Text strong>Phong cách tối giản:</Text> Gọn gàng, lịch sự, không
            lỗi mốt.
          </li>
        </ul>

        <Divider />

        <Title level={3}>Lý do nên chọn D-Wear</Title>
        <ul style={{ fontSize: 16, lineHeight: 2 }}>
          <li>
            <TruckOutlined style={{ marginRight: 8 }} />
            Giao hàng nhanh chóng trên toàn quốc.
          </li>
          <li>
            <UndoOutlined style={{ marginRight: 8 }} />
            Đổi trả dễ dàng trong 7 ngày.
          </li>
          <li>
            <GiftOutlined style={{ marginRight: 8 }} />
            Ưu đãi hấp dẫn cập nhật mỗi tuần.
          </li>
        </ul>

        <Divider />

        <Title level={3}>Liên hệ</Title>
        <Paragraph style={{ fontSize: 16 }}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          <Text strong>Địa chỉ:</Text> Số 9 Trịnh Văn Bô, Hà Nội
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          <PhoneOutlined style={{ marginRight: 8 }} />
          <Text strong>Hotline:</Text> 0909 123 456
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          <MailOutlined style={{ marginRight: 8 }} />
          <Text strong>Email:</Text> support@dwear.vn
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          <GlobalOutlined style={{ marginRight: 8 }} />
          <Text strong>Website:</Text> www.dwear.vn
        </Paragraph>
        <Paragraph style={{ fontSize: 16 }}>
          <FacebookOutlined style={{ marginRight: 8 }} />
          <Text strong>Facebook/Zalo/Instagram:</Text> @dwear.vn
        </Paragraph>
      </Typography>
    </div>
  );
};

export default AboutPage;
