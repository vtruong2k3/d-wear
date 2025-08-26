import { Card, Row, Col, Input, Button, Timeline, message } from 'antd';
import {
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    SendOutlined,
    MessageOutlined,
    CustomerServiceOutlined,
    ShopOutlined,
    CheckCircleOutlined,
    HeartOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

const ContactPage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.');
            setLoading(false);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <EnvironmentOutlined className="text-3xl text-amber-600" />,
            title: "Địa Chỉ Cửa Hàng",
            content: "123 Đường Thời Trang, Quận Cầu Giấy, TP. Hà Nội",
            subContent: "Tầng 2-3, Tòa nhà Fashion Center",
            gradient: "from-amber-50 to-orange-50",
            borderColor: "!border-amber-200"
        },
        {
            icon: <PhoneOutlined className="text-3xl text-emerald-600" />,
            title: "Số Điện Thoại",
            content: "+84 901 234 567",
            subContent: "Hotline hỗ trợ 24/7",
            gradient: "from-emerald-50 to-green-50",
            borderColor: "!border-emerald-200"
        },
        {
            icon: <MailOutlined className="text-3xl text-blue-600" />,
            title: "Email Liên Hệ",
            content: "contact@dwear.vn",
            subContent: "Phản hồi trong vòng 2h",
            gradient: "from-blue-50 to-indigo-50",
            borderColor: "!border-blue-200"
        },
        {
            icon: <ClockCircleOutlined className="text-3xl text-purple-600" />,
            title: "Giờ Mở Cửa",
            content: "8:00 - 22:00 (T2-CN)",
            subContent: "Tất cả các ngày trong tuần",
            gradient: "from-purple-50 to-pink-50",
            borderColor: "!border-purple-200"
        }
    ];

    const services = [
        {
            icon: <CustomerServiceOutlined className="text-4xl text-rose-600" />,
            title: "Tư Vấn Cá Nhân",
            description: "Stylist chuyên nghiệp tư vấn phong cách phù hợp với từng khách hàng",
            gradient: "!from-rose-500 !to-pink-600"
        },
        {
            icon: <HeartOutlined className="text-4xl text-amber-600" />,
            title: "Dịch Vụ VIP",
            description: "Chăm sóc khách hàng thân thiết với ưu đãi và quyền lợi đặc biệt",
            gradient: "!from-amber-500 !to-orange-600"
        },
        {
            icon: <ShopOutlined className="text-4xl text-indigo-600" />,
            title: "Đặt Hàng Online",
            description: "Mua sắm trực tuyến với giao hàng nhanh chóng và đảm bảo chất lượng",
            gradient: "!from-indigo-500 !to-purple-600"
        }
    ];

    const timeline = [
        {
            color: 'rgb(245, 158, 11)',
            children: (
                <div>
                    <h4 className="font-bold text-white-800 text-lg">Bước 1: Liên Hệ</h4>
                    <p className="text-white-600 mt-2">Gửi thông tin qua form hoặc gọi điện trực tiếp đến hotline</p>
                </div>
            ),
        },
        {
            color: 'rgb(16, 185, 129)',
            children: (
                <div>
                    <h4 className="font-bold text-white-800 text-lg">Bước 2: Tư Vấn</h4>
                    <p className="text-white-600 mt-2">Stylist chuyên nghiệp sẽ tư vấn phong cách phù hợp</p>
                </div>
            ),
        },
        {
            color: 'rgb(79, 70, 229)',
            children: (
                <div>
                    <h4 className="font-bold text-white-800 text-lg">Bước 3: Lựa Chọn</h4>
                    <p className="text-white-600 mt-2">Chọn sản phẩm và dịch vụ theo nhu cầu cá nhân</p>
                </div>
            ),
        },
        {
            color: 'rgb(168, 85, 247)',
            children: (
                <div>
                    <h4 className="font-bold text-white-800 text-lg">Bước 4: Hoàn Tất</h4>
                    <p className="text-white-600 mt-2">Nhận sản phẩm và trải nghiệm dịch vụ đẳng cấp</p>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Decorative elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 py-32 text-center">
                    <div className="inline-block p-3 bg-amber-500/20 rounded-2xl mb-6">
                        <MessageOutlined className="text-4xl text-amber-400" />
                    </div>
                    <h1 className="!text-4xl md:!text-5xl font-black mb-8 !bg-gradient-to-r !from-white !via-gray-100 !to-amber-100 bg-clip-text text-transparent leading-tight">
                        Liên Hệ
                    </h1>
                    <p className="!text-2xl !text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                        Chúng tôi luôn <span className="!text-amber-400 font-semibold">sẵn sàng lắng nghe</span> và
                        hỗ trợ bạn với đội ngũ chuyên gia <span className="!text-white font-semibold">tận tâm 24/7</span>.
                    </p>
                    <div className="flex justify-center space-x-8 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-emerald-400" />
                            <span>Phản hồi nhanh chóng</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-emerald-400" />
                            <span>Tư vấn chuyên nghiệp</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-emerald-400" />
                            <span>Hỗ trợ 24/7</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="py-20 bg-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <Row gutter={[32, 32]}>
                        {contactInfo.map((info, index) => (
                            <Col xs={24} md={12} lg={6} key={index}>
                                <Card className={`h-full !border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-gradient-to-br ${info.gradient} rounded-3xl overflow-hidden group ${info.borderColor} !border-2`}>
                                    <div className="p-8 text-center">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            {info.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                                        <p className="text-gray-800 font-semibold mb-2">{info.content}</p>
                                        <p className="text-gray-600 text-sm">{info.subContent}</p>
                                        <div className="mt-6">
                                            <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 mx-auto rounded-full group-hover:from-amber-400 group-hover:to-amber-600 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Contact Form & Process */}
            <div className="py-24 bg-gradient-to-br from-gray-50 to-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4">
                    <Row gutter={[64, 64]} align="middle">
                        {/* Contact Form */}
                        <Col xs={24} lg={14}>
                            <div className="bg-white p-12 rounded-3xl shadow-2xl !border !border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500"></div>

                                <div className="mb-8">
                                    <h2 className="!text-xl font-black text-gray-900 mb-6 leading-tight">
                                        Gửi Tin Nhắn<br />
                                        <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                            Cho Chúng Tôi
                                        </span>
                                    </h2>
                                    <p className="!text-lg text-gray-600">
                                        Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong vòng 24 giờ
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <Row gutter={[24, 24]}>
                                        <Col xs={24} md={12}>
                                            <div className="space-y-2">
                                                <label className="text-gray-700 font-semibold block">Họ và Tên</label>
                                                <Input
                                                    placeholder="Nhập họ và tên của bạn"
                                                    className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300"
                                                    size="large"
                                                />
                                            </div>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <div className="space-y-2">
                                                <label className="text-gray-700 font-semibold block">Số Điện Thoại</label>
                                                <Input
                                                    placeholder="Nhập số điện thoại"
                                                    className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300"
                                                    size="large"
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="space-y-2">
                                        <label className="text-gray-700 font-semibold block">Email</label>
                                        <Input
                                            placeholder="Nhập địa chỉ email"
                                            className="rounded-xl !border-2 !order-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300"
                                            size="large"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-gray-700 font-semibold block">Nội Dung Tin Nhắn</label>
                                        <TextArea
                                            rows={6}
                                            placeholder="Chia sẻ với chúng tôi về nhu cầu, câu hỏi hoặc ý kiến của bạn..."
                                            className="rounded-xl !border-2 !border-gray-200 hover:!border-amber-400 focus:!border-amber-500 transition-colors duration-300"
                                        />
                                    </div>

                                    <Button
                                        type="primary"
                                        loading={loading}
                                        icon={<SendOutlined />}
                                        className="w-full !h-14 !bg-gradient-to-r !from-amber-500 !to-orange-600 hover:!from-amber-600 hover:!to-orange-700 !border-0 rounded-xl text-lg font-bold shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                                        onClick={handleSubmit}
                                    >
                                        {loading ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}
                                    </Button>
                                </div>
                            </div>
                        </Col>

                        {/* Process Timeline */}
                        <Col xs={24} lg={10}>
                            <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-indigo-600/10"></div>

                                <div className="relative">
                                    <div className="text-center mb-10">
                                        <h3 className="text-3xl font-bold mb-4">Quy Trình Hỗ Trợ</h3>
                                        <div className="w-20 h-1 !bg-gradient-to-r !from-amber-400 !to-amber-600 mx-auto rounded-full"></div>
                                    </div>

                                    <Timeline
                                        items={timeline}
                                        className="custom-timeline"
                                        mode="left"
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
                            <TeamOutlined className="text-indigo-600 text-xl" />
                            <span className="text-indigo-800 font-semibold">DỊCH VỤ KHÁCH HÀNG</span>
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-6">
                            Cam Kết
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Dịch Vụ</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Trải nghiệm dịch vụ đẳng cấp với đội ngũ chuyên nghiệp tận tâm
                        </p>
                    </div>

                    <Row gutter={[48, 48]}>
                        {services.map((service, index) => (
                            <Col xs={24} lg={8} key={index}>
                                <Card className="h-full !-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 rounded-3xl overflow-hidden bg-white group">
                                    <div className="p-10 text-center">
                                        <div className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <div className="text-white">
                                                {service.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                        <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>

                                        <div className="mt-8 pt-6 !border-t !rder-gray-200">
                                            <div className="flex justify-center">
                                                <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full group-hover:from-amber-400 group-hover:to-amber-600 transition-all duration-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Map Section */}
            <div className="py-24 bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-green-100 px-6 py-3 rounded-full mb-6">
                            <EnvironmentOutlined className="text-emerald-600 text-xl" />
                            <span className="text-emerald-800 font-semibold">VỊ TRÍ CỬA HÀNG</span>
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-6">
                            Tìm Đến
                            <span className="!bg-gradient-to-r !from-emerald-600 !to-green-600 bg-clip-text text-transparent"> Chúng Tôi</span>
                        </h2>
                    </div>

                    <Card className="!border-0 shadow-2xl rounded-3xl overflow-hidden">
                        <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                                <EnvironmentOutlined className="text-6xl text-gray-400 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-600 mb-2">Bản Đồ Cửa Hàng</h3>
                                <p className="text-gray-500">123 Đường Thời Trang, Quận Cầu Giấy, TP. Hà Nội</p>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="!mt-4 !bg-gradient-to-r !from-emerald-500 !to-green-600 !border-0 rounded-xl"
                                >
                                    Xem Chỉ Đường
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                <div className="absolute top-10 left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
                    <div className="mb-8">
                        <div className="inline-block p-4 bg-amber-500/20 rounded-3xl mb-6">
                            <PhoneOutlined className="text-5xl text-amber-400" />
                        </div>
                        <h2 className="!text-3xl font-black mb-6 leading-tight">
                            Liên Hệ
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Ngay</span>
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
                            Đừng ngần ngại liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        <Button
                            size="large"
                            icon={<PhoneOutlined />}
                            className="!bg-gradient-to-r !from-amber-500 !to-orange-600 hover:!from-amber-600 hover:!to-orange-700 !text-white !border-0 !px-10 !py-6 !h-auto !text-xl font-bold rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                        >
                            Gọi Ngay: 0901 234 567
                        </Button>
                        <Button
                            size="large"
                            icon={<MailOutlined />}
                            className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-gray-900 !px-10 !py-6 !h-auto !text-xl font-bold rounded-full transition-all duration-300 hover:scale-105"
                        >
                            Email: contact@dwear.vn
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-amber-400">2H</div>
                            <div className="text-gray-300">Phản hồi email</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-emerald-400">24/7</div>
                            <div className="text-gray-300">Hotline hỗ trợ</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-indigo-400">100%</div>
                            <div className="text-gray-300">Hài lòng khách hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;