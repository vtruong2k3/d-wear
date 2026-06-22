import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Result } from "antd";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để render fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <Result
            status="500"
            title="Đã xảy ra lỗi!"
            subTitle="Xin lỗi, ứng dụng đã gặp sự cố không mong muốn."
            extra={<Button type="primary" onClick={() => window.location.href = '/'}>Quay lại trang chủ</Button>}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
