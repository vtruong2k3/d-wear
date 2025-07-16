import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { useDispatch } from "react-redux";
import { clearSelectedUser } from "../../../../redux/features/admin/userSlice";

const UserDetailModal = ({ user }: { user: any }) => {
  const dispatch = useDispatch();

  return (
    <Modal
      open={!!user}
      title="Chi tiết người dùng"
      onCancel={() => dispatch(clearSelectedUser())}
      footer={null}
    >
      {user && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phone || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color={user.role === "admin" ? "volcano" : "blue"}>
              {user.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={user.status === "active" ? "green" : "red"}>
              {user.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(user.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default UserDetailModal;
