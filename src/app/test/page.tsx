'use client';

import { useState } from 'react';

export default function TestPage() {
    const [testResult, setTestResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testAPI = async (endpoint: string) => {
        setLoading(true);
        setTestResult(`Testing ${endpoint}...\n`);

        try {
            console.log(`Testing ${endpoint}...`);
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = {
                status: response.status,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries()),
            };

            let data;
            try {
                data = await response.json();
            } catch {
                data = await response.text();
            }

            const fullResult = {
                ...result,
                data
            };

            console.log(`${endpoint} result:`, fullResult);
            setTestResult(prev => prev + `✅ ${endpoint}: ${JSON.stringify(fullResult, null, 2)}\n`);
        } catch (error) {
            console.error(`${endpoint} error:`, error);
            setTestResult(prev => prev + `❌ ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
        } finally {
            setLoading(false);
        }
    };

    const runAllTests = async () => {
        setTestResult('Starting API tests...\n');
        await testAPI('/api/test');
        await testAPI('/api/products');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

                <div className="space-y-4 mb-6">
                    <button
                        onClick={() => testAPI('/api/test')}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        Test /api/test
                    </button>

                    <button
                        onClick={() => testAPI('/api/products')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400 ml-2"
                    >
                        Test /api/products
                    </button>

                    <button
                        onClick={runAllTests}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-400 ml-2"
                    >
                        Run All Tests
                    </button>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                        {testResult || 'No tests run yet'}
                    </pre>
                </div>
            </div>
        </div>
    );
} 