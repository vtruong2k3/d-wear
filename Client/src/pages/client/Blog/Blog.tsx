import { Card, Row, Col, Tag, Input, Button, Pagination } from 'antd';
import {
    SearchOutlined,
    CalendarOutlined,
    UserOutlined,
    EyeOutlined,
    HeartOutlined,
    FireOutlined,
    ClockCircleOutlined,
    StarOutlined,
    TrophyOutlined,
    CrownOutlined,
    ThunderboltOutlined,
    BookOutlined,
    CheckCircleOutlined,
    MailOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Search } = Input;

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const categories = [
        { key: 'all', label: 'Tất Cả', icon: <BookOutlined />, color: 'default' },
        { key: 'fashion-trend', label: 'Xu Hướng Thời Trang', icon: <FireOutlined />, color: 'red' },
        { key: 'styling-tips', label: 'Bí Quyết Phối Đồ', icon: <StarOutlined />, color: 'gold' },
        { key: 'fashion-guide', label: 'Cẩm Nang Thời Trang', icon: <TrophyOutlined />, color: 'blue' },
        { key: 'brand-story', label: 'Câu Chuyện Thương Hiệu', icon: <CrownOutlined />, color: 'purple' }
    ];

    const blogPosts = [
        {
            id: 1,
            title: "10 Cách Phối Áo Sơ Mi Nam Sang Trọng Cho Dân Công Sở",
            excerpt: "Khám phá những cách phối áo sơ mi nam đơn giản nhưng hiệu quả để tạo nên vẻ ngoài chuyên nghiệp và lịch lãm trong môi trường công sở.",
            category: "styling-tips",
            author: "Stylist Minh Anh",
            date: "15 Tháng 8, 2025",
            readTime: "8 phút đọc",
            views: 2450,
            likes: 156,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
            featured: true,
            tags: ["Áo Sơ Mi", "Công Sở", "Phối Đồ"]
        },
        {
            id: 2,
            title: "Xu Hướng Thời Trang Nam 2025: Minimalism Và Sustainability",
            excerpt: "Tìm hiểu về hai xu hướng lớn nhất trong thời trang nam 2025 - phong cách tối giản và thời trang bền vững đang làm mưa làm gió.",
            category: "fashion-trend",
            author: "Fashion Editor",
            date: "12 Tháng 18, 2025",
            readTime: "6 phút đọc",
            views: 3200,
            likes: 289,
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
            featured: true,
            tags: ["Xu Hướng 2025", "Minimalism", "Sustainability"]
        },
        {
            id: 3,
            title: "Bí Quyết Chọn Suit Hoàn Hảo Theo Dáng Người",
            excerpt: "Hướng dẫn chi tiết cách chọn bộ suit phù hợp với từng dáng người để tôn lên những ưu điểm và che đi khuyết điểm một cách khéo léo.",
            category: "fashion-guide",
            author: "Tailor Master",
            date: "10 Tháng 8, 2025",
            readTime: "12 phút đọc",
            views: 1890,
            likes: 124,
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=250&fit=crop",
            featured: false,
            tags: ["Suit", "Dáng Người", "Formal Wear"]
        },
        {
            id: 4,
            title: "Câu Chuyện Đằng Sau Thương Hiệu D-Wear",
            excerpt: "Khám phá hành trình 10 năm xây dựng và phát triển thương hiệu D-Wear từ một xưởng nhỏ thành chuỗi cửa hàng thời trang uy tín.",
            category: "brand-story",
            author: "D-Wear Team",
            date: "8 Tháng 8, 2025",
            readTime: "15 phút đọc",
            views: 4100,
            likes: 456,
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
            featured: false,
            tags: ["D-Wear", "Thương Hiệu", "Câu Chuyện"]
        },
        {
            id: 5,
            title: "5 Món Đồ Essential Mọi Quý Ông Cần Có Trong Tủ Đồ",
            excerpt: "Danh sách những món đồ thiết yếu giúp bạn xây dựng một tủ đồ versatile và timeless, phù hợp với mọi dịp và hoàn cảnh.",
            category: "fashion-guide",
            author: "Style Consultant",
            date: "5 Tháng 8, 2025",
            readTime: "7 phút đọc",
            views: 2780,
            likes: 203,
            image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=250&fit=crop",
            featured: false,
            tags: ["Essential", "Tủ Đồ", "Versatile"]
        },
        {
            id: 6,
            title: "Cách Mix & Match Đồ Hàng Ngày Cho Nam Giới Bận Rộn",
            excerpt: "Những tip mix & match thông minh giúp các quý ông bận rộn luôn trông lịch lãm và phong cách mà không tốn quá nhiều thời gian.",
            category: "styling-tips",
            author: "Quick Style Expert",
            date: "2 Tháng 8, 2025",
            readTime: "5 phút đọc",
            views: 1650,
            likes: 98,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop",
            featured: false,
            tags: ["Mix & Match", "Hàng Ngày", "Quick Style"]
        }
    ];

    const trendingTags = [
        "Xu Hướng 2025", "Áo Sơ Mi", "Suit", "Phối Đồ", "Công Sở",
        "Minimalism", "D-Wear", "Essential", "Style Tips", "Fashion Guide"
    ];

    const filteredPosts = selectedCategory === 'all'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    const featuredPosts = blogPosts.filter(post => post.featured);

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
                        <BookOutlined className="text-4xl text-amber-400" />
                    </div>
                    <h1 className="!text-4xl md:!text-5xl font-black mb-8 bg-gradient-to-r from-white via-gray-100 to-amber-100 bg-clip-text text-transparent leading-tight">
                        Fashion Blog
                    </h1>
                    <p className="!text-2xl !text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                        Khám phá <span className="text-amber-400 font-semibold">xu hướng thời trang</span> mới nhất,
                        <span className="text-white font-semibold"> bí quyết phối đồ</span> và những câu chuyện
                        thú vị từ thế giới thời trang nam.
                    </p>
                    <div className="flex justify-center space-x-8 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-emerald-400" />
                            <span>Cập nhật hàng tuần</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-emerald-400" />
                            <span>Chuyên gia tư vấn</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircleOutlined className="text-emerald-400" />
                            <span>Xu hướng mới nhất</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Posts Section */}
            <div className="py-20 bg-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
                            <FireOutlined className="text-amber-600 text-xl" />
                            <span className="text-amber-800 font-semibold">BÀI VIẾT NỔI BẬT</span>
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-6">
                            Trending
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Stories</span>
                        </h2>
                    </div>

                    <Row gutter={[48, 48]}>
                        {featuredPosts.map((post) => (
                            <Col xs={24} lg={12} key={post.id}>
                                <Card
                                    className="!h-full !border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-3xl overflow-hidden group cursor-pointer"
                                    cover={
                                        <div className="relative overflow-hidden">
                                            <img
                                                alt={post.title}
                                                src={post.image}
                                                className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Tag color={categories.find(cat => cat.key === post.category)?.color} className="font-semibold">
                                                    {categories.find(cat => cat.key === post.category)?.label}
                                                </Tag>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    Featured
                                                </div>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {post.tags.map(tag => (
                                                <Tag key={tag} className="!-gray-200 text-gray-600 hover:!border-amber-400 hover:text-amber-600 cursor-pointer transition-colors duration-200">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 !border-t !border-gray-100">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <CalendarOutlined />
                                                    <span>{post.date}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <ClockCircleOutlined />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <EyeOutlined />
                                                    <span>{post.views.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <HeartOutlined />
                                                    <span>{post.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Search & Filter Section */}
            <div className="py-16 bg-gradient-to-br from-gray-50 to-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white p-8 rounded-3xl shadow-xl !border !border-gray-100">
                        <Row gutter={[32, 24]} align="middle">
                            <Col xs={24} lg={12}>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900">Tìm Kiếm Bài Viết</h3>
                                    <Search
                                        placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc tác giả..."
                                        enterButton={<SearchOutlined />}
                                        size="large"
                                        className="rounded-xl"
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900">Danh Mục</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {categories.map(category => (
                                            <Button
                                                key={category.key}
                                                icon={category.icon}
                                                onClick={() => setSelectedCategory(category.key)}
                                                className={`rounded-full !border-2 transition-all duration-300 ${selectedCategory === category.key
                                                    ? '!bg-gradient-to-r !from-amber-500 !to-orange-600 text-white !border-amber-500 shadow-lg'
                                                    : '!border-gray-200 !text-gray-600 hover:!border-amber-400 hover:!text-amber-600'
                                                    }`}
                                            >
                                                {category.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
                            <ThunderboltOutlined className="text-indigo-600 text-xl" />
                            <span className="text-indigo-800 font-semibold">TẤT CẢ BÀI VIẾT</span>
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-6">
                            Latest
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Articles</span>
                        </h2>
                    </div>

                    <Row gutter={[32, 48]}>
                        {filteredPosts.map(post => (
                            <Col xs={24} md={12} lg={8} key={post.id}>
                                <Card
                                    className="!h-full !border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden group cursor-pointer"
                                    cover={
                                        <div className="relative overflow-hidden">
                                            <img
                                                alt={post.title}
                                                src={post.image}
                                                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Tag color={categories.find(cat => cat.key === post.category)?.color} className="font-semibold">
                                                    {categories.find(cat => cat.key === post.category)?.label}
                                                </Tag>
                                            </div>
                                            {post.featured && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                        Hot
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <UserOutlined />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <ClockCircleOutlined />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between !pt-4 !border-t !border-gray-100">
                                            <span className="text-sm text-gray-500">{post.date}</span>
                                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <EyeOutlined />
                                                    <span>{post.views.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500 transition-colors duration-200">
                                                    <HeartOutlined />
                                                    <span>{post.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div className="text-center mt-16">
                        <Pagination
                            current={currentPage}
                            total={filteredPosts.length}
                            pageSize={6}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            className="custom-pagination"
                        />
                    </div>
                </div>
            </div>

            {/* Trending Tags Section */}
            <div className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-rose-100 to-pink-100 px-6 py-3 rounded-full mb-6">
                            <StarOutlined className="text-rose-600 text-xl" />
                            <span className="text-rose-800 font-semibold">TRENDING TAGS</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-6">
                            Chủ Đề
                            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Hot Nhất</span>
                        </h2>
                    </div>

                    <div className="!bg-white !p-12 rounded-3xl shadow-xl !border !border-gray-100">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {trendingTags.map(tag => (
                                <Tag
                                    key={tag}
                                    className="px-4 py-2 text-base !border-2 !border-gray-200 text-gray-600 hover:!border-rose-400 hover:text-rose-600 cursor-pointer transition-all duration-300 hover:scale-105 rounded-full"
                                >
                                    #{tag}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                <div className="absolute top-10 left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
                    <div className="mb-8">
                        <div className="inline-block p-4 bg-amber-500/20 rounded-3xl mb-6">
                            <MailOutlined className="text-5xl text-amber-400" />
                        </div>
                        <h2 className="!text-4xl font-black !mb-6 leading-tight">
                            Đăng Ký
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Newsletter</span>
                        </h2>
                        <p className="!text-xl !text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
                            Nhận thông báo về những bài viết mới nhất, xu hướng thời trang hot và
                            những ưu đãi độc quyền từ D-Wear
                        </p>
                    </div>

                    <div className="!max-w-md !mx-auto !mb-12">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Nhập email của bạn..."
                                size="large"
                                className="rounded-full !border-2 !border-white/20 !bg-white/10 !text-white placeholder:!text-white/70"
                            />
                            <Button
                                type="primary"
                                size="large"
                                className="!bg-gradient-to-r !from-amber-500 !to-orange-600 hover:!from-amber-600 hover:!to-orange-700 !border-0 rounded-full !px-8 font-bold"
                            >
                                Đăng Ký
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-amber-400">2x</div>
                            <div className="text-gray-300">Bài viết mỗi tuần</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-emerald-400">100%</div>
                            <div className="text-gray-300">Nội dung chất lượng</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-indigo-400">Free</div>
                            <div className="text-gray-300">Hoàn toàn miễn phí</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;