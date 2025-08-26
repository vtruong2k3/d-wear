
import { Card, Row, Col, Timeline, Statistic, Avatar } from 'antd';
import { TeamOutlined, HeartOutlined, ShopOutlined, StarOutlined, CheckCircleOutlined, CrownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import '../../../styles/about.css'
const AboutPage = () => {
  const stats = [
    { title: 'Năm Kinh Nghiệm', value: 10, suffix: '+', color: 'text-s' },
    { title: 'Khách Hàng', value: 5000, suffix: '+', color: 'text-emerald-600' },
    { title: 'Chất Lượng', value: 200, suffix: '+', color: 'text-blue-600' },
    { title: 'Cửa Hàng', value: 2, suffix: '+', color: 'text-purple-600' }
  ];

  const values = [
    {
      icon: <CrownOutlined className="text-5xl text-amber-600" />,
      title: "Chất Lượng Vượt Trội",
      description: "Chúng tôi cam kết mang đến những sản phẩm với chất lượng vải cao cấp nhập khẩu, đường may tỉ mỉ và thiết kế tinh tế từ các nhà thiết kế hàng đầu.",
      gradient: "from-amber-50 to-orange-50"
    },
    {
      icon: <HeartOutlined className="text-5xl text-rose-600" />,
      title: "Dịch Vụ Tận Tâm",
      description: "Đội ngũ stylist chuyên nghiệp với kinh nghiệm hơn 10 năm, luôn sẵn sàng tư vấn phong cách cá nhân và hỗ trợ khách hàng 24/7.",
      gradient: "from-rose-50 to-pink-50"
    },
    {
      icon: <ThunderboltOutlined className="text-5xl text-indigo-600" />,
      title: "Xu Hướng Dẫn Đầu",
      description: "Cập nhật liên tục các xu hướng thời trang quốc tế từ Milan, Paris, New York, mang đến phong cách đa dạng cho mọi dịp và độ tuổi.",
      gradient: "from-indigo-50 to-blue-50"
    }
  ];

  const timeline = [
    {
      color: 'rgb(245, 158, 11)',
      children: (
        <div>
          <h4 className="font-bold text-white-800 text-lg">2023 - Khởi Nghiệp</h4>
          <p className="text-white-600 mt-2">Thành lập cửa hàng đầu tiên tại trung tâm Hà Nội với 50 thiết kế áo sơ mi và quần âu cao cấp</p>
        </div>
      ),
    },
    {
      color: 'rgb(16, 185, 129)',
      children: (
        <div>
          <h4 className="font-bold text-white-800 text-lg">2024 - Mở Rộng Quy Mô</h4>
          <p className="text-white-600 mt-2">Khai trương 2 chi nhánh mới và ra mắt bộ sưu tập Business Premium với hơn 200 mẫu thiết kế</p>
        </div>
      ),
    },
    {
      color: 'rgb(79, 70, 229)',
      children: (
        <div>
          <h4 className="font-bold text-white-800 text-lg">2025 - Chuyển Đổi Số</h4>
          <p className="text-white-600 mt-2">Phát triển nền tảng e-commerce và ứng dụng mobile, triển khai dịch vụ tư vấn online</p>
        </div>
      ),
    },
    {
      color: 'rgb(168, 85, 247)',
      children: (
        <div>
          <h4 className="font-bold text-white-800 text-lg">2025 - Thương Hiệu Hàng Đầu</h4>
          <p className="text-white-600 mt-2">Đạt mốc 5000+ khách hàng thân thiết và trở thành Top 3 thương hiệu thời trang nam uy tín</p>
        </div>
      ),
    },
  ];

  const teamMembers = [
    {
      name: "Vu Van Truong",
      position: "Founder & CEO",
      avatar: "VT",
      bg: "bg-gradient-to-br from-amber-500 to-orange-600",
      experience: "10+ năm kinh nghiệm thời trang"
    },
    {
      name: "Lê Thị Hạnh",
      position: "Creative Director",
      avatar: "LH",
      bg: "bg-gradient-to-br from-rose-500 to-pink-600",
      experience: "Chuyên gia xu hướng quốc tế"
    },
    {
      name: "Phạm Đức Tú",
      position: "Head of Design",
      avatar: "PT",
      bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
      experience: "Nhà thiết kế trẻ tài năng"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Hero Section - Enhanced */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="inline-block p-3 bg-amber-500/20 rounded-2xl mb-6">
            <CrownOutlined className="text-4xl text-amber-400" />
          </div>
          <h1 className="!text-2xl md:!text-5xl font-black mb-8 !bg-gradient-to-r !from-white !via-gray-100 !to-amber-100 bg-clip-text !text-transparent leading-tight">
            Về Chúng Tôi
          </h1>
          <p className="!text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            <span className="text-amber-400 font-semibold">10+ năm kinh nghiệm</span> trong việc tạo ra những trang phục
            đẳng cấp cho phái mạnh Việt Nam. Chúng tôi không chỉ bán quần áo,
            mà còn <span className="text-white font-semibold">định nghĩa phong cách</span>.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircleOutlined className="text-emerald-400" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleOutlined className="text-emerald-400" />
              <span>Expert Styling</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleOutlined className="text-emerald-400" />
              <span>Trusted Brand</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Redesigned */}
      <div className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <Row gutter={[48, 48]}>
            {stats.map((stat, index) => (
              <Col xs={12} lg={6} key={index}>
                <Card className=" w-70 h-90 text-center !border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white rounded-3xl overflow-hidden group">
                  <div className="p-8">
                    <Statistic
                      title={
                        <div className="space-y-2">
                          <div className="w-16 h-1 bg-gradient-to-r from-gray-200 to-gray-400 mx-auto rounded-full group-hover:from-amber-400 group-hover:to-amber-600 transition-all duration-300"></div>
                          <span className="text-gray-600 font-semibold text-lg">{stat.title}</span>
                        </div>
                      }
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #1f2937, #374151)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Story Section - Enhanced Layout */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[64, 64]} align="middle">
            <Col xs={24} lg={14}>
              <div className="bg-white p-12 rounded-3xl shadow-2xl !border !border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500"></div>

                <div className="mb-8">
                  <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
                    Câu Chuyện<br />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Đam Mê
                    </span>
                  </h2>
                </div>

                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-gray-700">
                    Khởi đầu từ <span className="font-semibold text-gray-900">một studio nhỏ</span> với ước mơ
                    mang đến cho phái mạnh Việt Nam những bộ trang phục không chỉ đẹp mà còn
                    <span className="font-semibold text-amber-600"> thể hiện cá tính</span> và
                    <span className="font-semibold text-indigo-600"> đẳng cấp riêng</span>.
                  </p>

                  <p className="text-gray-700">
                    Qua <span className="font-bold text-gray-900">hơn một thập kỷ</span>, chúng tôi đã xây dựng
                    được niềm tin từ hàng nghìn khách hàng bằng chính sách
                    <span className="font-semibold text-emerald-600"> "Chất lượng là danh dự"</span>.
                  </p>

                  <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 rounded-2xl !border !border-amber-100">
                    <p className="text-gray-800 font-medium italic">
                      "Từ áo sơ mi thanh lịch, quần âu sang trọng đến áo polo năng động -
                      mỗi sản phẩm đều mang trong mình câu chuyện về sự tỉ mỉ,
                      từ khâu chọn chất liệu cho đến từng đường kim mũi chỉ."
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={10}>
              <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-indigo-600/10"></div>

                <div className="relative">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold mb-4">Hành Trình Phát Triển</h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
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

      {/* Values Section - Premium Design */}
      <div className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
              <StarOutlined className="text-amber-600 text-xl" />
              <span className="text-amber-800 font-semibold">GIÁ TRỊ CỐT LÕI</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Tại Sao Chọn
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Chúng Tôi?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ba trụ cột vững chắc tạo nên sự khác biệt và giá trị bền vững cho thương hiệu
            </p>
          </div>

          <Row gutter={[48, 48]}>
            {values.map((value, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card className={`h-full !border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 rounded-3xl overflow-hidden bg-gradient-to-br ${value.gradient} group`}>
                  <div className="p-10">
                    <div className="text-center mb-8">
                      <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{value.description}</p>

                    <div className="mt-8 pt-6 !border-t !border-gray-200">
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

      {/* Team Section - Modern Cards */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
              <TeamOutlined className="text-indigo-600 text-xl" />
              <span className="text-indigo-800 font-semibold">ĐỘI NGŨ CHUYÊN NGHIỆP</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Những
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Tài Năng
              </span> Hàng Đầu
            </h2>
            <p className="text-xl text-gray-600">
              Đội ngũ chuyên gia với kinh nghiệm quốc tế và đam mê không giới hạn
            </p>
          </div>

          <Row gutter={[48, 48]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className=" w-90 h-120 text-center !border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 rounded-3xl bg-white overflow-hidden group">
                  <div className="p-10">
                    <div className="relative mb-8">
                      <Avatar
                        size={140}
                        className={`mx-auto ${member.bg} shadow-2xl group-hover:scale-105 transition-transform duration-300`}
                      >
                        <span className="text-3xl font-bold text-white">{member.avatar}</span>
                      </Avatar>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircleOutlined className="text-white text-sm" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-indigo-600 font-semibold text-lg mb-4">{member.position}</p>
                    <p className="text-gray-600 text-base leading-relaxed">{member.experience}</p>

                    <div className="mt-8 pt-6 !border-t !border-gray-100">
                      <div className="w-16 h-1 bg-gradient-to-r from-gray-200 to-gray-300 mx-auto rounded-full group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300"></div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section - Premium Design */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
          <div className="mb-8">
            <div className="inline-block p-4 bg-amber-500/20 rounded-3xl mb-6">
              <ShopOutlined className="text-5xl text-amber-400" />
            </div>
            <h2 className="text-6xl font-black mb-6 leading-tight">
              Trải Nghiệm
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Đẳng Cấp
              </span>
            </h2>
            <p className="text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Hãy để chúng tôi giúp bạn tạo nên phong cách riêng với dịch vụ tư vấn cá nhân hóa
              và những sản phẩm chất lượng cao nhất.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105">
              Đặt Lịch Tư Vấn
            </button>
            <button className="bg-transparent !border-2 !border-white text-white hover:bg-white hover:!text-gray-900 px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105">
              Xem Bộ Sưu Tập
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-amber-400">Free</div>
              <div className="text-gray-300">Tư vấn phong cách</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">24/7</div>
              <div className="text-gray-300">Hỗ trợ khách hàng</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-400">100%</div>
              <div className="text-gray-300">Đảm bảo chất lượng</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AboutPage;