import { Spin } from 'antd';
import { useLoading } from '../../contexts/LoadingContext';

const GlobalLoading = () => {
    const { loading } = useLoading();

    return loading ? (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Spin size="large" tip="Đang tải..." />
        </div>
    ) : null;
};

export default GlobalLoading;
