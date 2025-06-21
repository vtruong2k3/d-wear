import { Layout, Avatar, Dropdown } from "antd";
const { Header } = Layout;

const AdminHeader = () => {
  return (
    <Header className="bg-white px-4 shadow flex justify-between items-center">
      <h1 className="text-xl text-white font-bold">Admin Panel</h1>
      <Dropdown
        menu={{
          items: [
            { key: "1", label: "Profile" },
            { key: "2", label: "Logout" },
          ],
        }}
      >
        <Avatar src="https://i.pravatar.cc/40" />
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
