import { Component, ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                    <Card className="max-w-lg w-full p-8">
                        <div className="text-center space-y-6">
                            {/* Icon */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    عذراً، حدث خطأ ما
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    نعتذر عن هذا الإزعاج. حدث خطأ غير متوقع في التطبيق.
                                </p>
                            </div>

                            {/* Error Details (Development Only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                    <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="text-xs text-gray-600 dark:text-gray-400">
                                            <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                                                عرض التفاصيل التقنية
                                            </summary>
                                            <pre className="mt-2 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={this.handleReset}
                                    className="bg-[#FB5E7A] hover:bg-[#e5536e]"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    حاول مرة أخرى
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/'}
                                    variant="outline"
                                >
                                    العودة للرئيسية
                                </Button>
                            </div>

                            {/* Support Info */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                إذا استمرت المشكلة، يرجى{' '}
                                <a
                                    href="mailto:support@khalaeyal.com"
                                    className="text-[#FB5E7A] hover:underline"
                                >
                                    التواصل مع الدعم الفني
                                </a>
                            </p>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
