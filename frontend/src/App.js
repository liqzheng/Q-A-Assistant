import React, { useState, useEffect } from 'react';
import { Layout, Upload, Button, Input, Card, List, message, Spin, Typography, Space, Divider } from 'antd';
import { UploadOutlined, SendOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

function App() {
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Load documents list
  const loadDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data.documents || []);
    } catch (error) {
      message.error('Failed to load documents list');
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Handle file upload
  const handleUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success(`Upload successful! Processed ${response.data.chunksCount} text chunks`);
      setAnswer('');
      setSources([]);
      loadDocuments();
    } catch (error) {
      message.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }

    return false; // Prevent auto upload
  };

  // Handle question
  const handleAsk = async () => {
    if (!question.trim()) {
      message.warning('Please enter a question');
      return;
    }

    setAsking(true);
    setAnswer('');
    setSources([]);

    try {
      const response = await axios.post('/api/ask', { question });
      setAnswer(response.data.answer);
      setSources(response.data.sources || []);
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to ask question');
    } finally {
      setAsking(false);
    }
  };

  // Clear all documents
  const handleClearDocuments = async () => {
    try {
      await axios.delete('/api/documents');
      message.success('All documents cleared');
      setDocuments([]);
      setAnswer('');
      setSources([]);
    } catch (error) {
      message.error('Failed to clear documents');
    }
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          <FileTextOutlined /> AI PDF Q&A Assistant
        </Title>
      </Header>
      <Content className="app-content">
        <div className="container">
          {/* Upload area */}
          <Card title="Upload PDF File" className="upload-card">
            <Upload
              accept=".pdf"
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={uploading}
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={uploading}
                size="large"
                block
              >
                {uploading ? 'Processing...' : 'Select PDF File'}
              </Button>
            </Upload>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Upload PDF files, the system will automatically parse and generate vector index
              </Text>
            </div>
          </Card>

          {/* Documents list */}
          {documents.length > 0 && (
            <Card
              title={`Uploaded Documents (${documents.length})`}
              extra={
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearDocuments}
                >
                  Clear
                </Button>
              }
              className="documents-card"
            >
              <List
                loading={loadingDocuments}
                dataSource={documents}
                renderItem={(doc) => (
                  <List.Item>
                    <Space>
                      <FileTextOutlined />
                      <Text>{doc.name}</Text>
                      <Text type="secondary">({doc.chunksCount} text chunks)</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Q&A area */}
          <Card title="Ask Question" className="qa-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <TextArea
                placeholder="Please enter your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                onPressEnter={(e) => {
                  if (e.shiftKey) return;
                  e.preventDefault();
                  handleAsk();
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleAsk}
                loading={asking}
                size="large"
                block
              >
                {asking ? 'Thinking...' : 'Ask'}
              </Button>
            </Space>
          </Card>

          {/* Answer area */}
          {answer && (
            <Card title="Answer" className="answer-card">
              <div className="answer-content">
                {answer.split('\n').map((line, index) => (
                  <p key={index} style={{ marginBottom: 8 }}>
                    {line}
                  </p>
                ))}
              </div>
              {sources.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <Text strong>Sources:</Text>
                    <List
                      size="small"
                      dataSource={sources}
                      renderItem={(source, index) => (
                        <List.Item>
                          <Text type="secondary">
                            [{index + 1}] {source.documentName}: {source.text}
                          </Text>
                        </List.Item>
                      )}
                    />
                  </div>
                </>
              )}
            </Card>
          )}

          {asking && !answer && (
            <Card className="answer-card">
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Analyzing documents and generating answer...</Text>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App;

