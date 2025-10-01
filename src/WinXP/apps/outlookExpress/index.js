import React, { useState } from 'react';
import styled from 'styled-components';
import resumeData from 'data/resume.json';
import emailjs from '@emailjs/browser';

const OutlookExpress = ({ onClose, isFocus }) => {
  const [view, setView] = useState('inbox'); 
  const [formData, setFormData] = useState({
    from: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const testimonials = [
    {
      from: 'Michael Baum',
      subject: 'Excellent Work on Transport Systems',
      date: 'Mon 9/15/2024 10:30 AM',
      preview: 'Anupama has shown exceptional skill in developing our transport regulation systems...',
      body: 'Anupama has shown exceptional skill in developing our transport regulation systems. His work on TRUMPS and MySAGOV has been outstanding, with particular attention to security and performance optimization.'
    },
    {
      from: 'Bill Tsouvalas',
      subject: 'Outstanding Angular Migration',
      date: 'Tue 12/20/2022 2:15 PM',
      preview: 'The Salesforce to Angular conversion project was completed ahead of schedule...',
      body: 'The Salesforce to Angular conversion project was completed ahead of schedule and exceeded our expectations. The application now handles significantly more load with improved user experience.'
    },
    {
      from: 'Development Team',
      subject: 'Welcome to the Portfolio',
      date: 'Wed 10/1/2025 9:00 AM',
      preview: 'Thanks for visiting! Feel free to reach out using the compose button...',
      body: 'Thanks for visiting my portfolio! I\'d love to hear from you. Click the "New Mail" button to send me a message, or explore other applications to learn more about my work.'
    }
  ];

  const [selectedMessage, setSelectedMessage] = useState(testimonials[0]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.from || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    setSending(true);
    setError('');
    
    try {
      // EmailJS configuration from environment variables
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing. Please check environment variables.');
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_name: resumeData.personal.name,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.from,
          from_email: formData.from
        },
        publicKey
      );

      setSending(false);
      setSent(true);
      
      setTimeout(() => {
        setSent(false);
        setView('inbox');
        setFormData({ from: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setSending(false);
      setError(err.text || err.message || 'Failed to send message. Please try again or email directly.');
    }
  };

  return (
    <Container>
      <Toolbar>
        <ToolbarButton onClick={() => setView('compose')} disabled={view === 'compose'}>
          <ButtonIcon>📧</ButtonIcon>
          <ButtonText>New Mail</ButtonText>
        </ToolbarButton>
        <ToolbarButton disabled>
          <ButtonIcon>↩️</ButtonIcon>
          <ButtonText>Reply</ButtonText>
        </ToolbarButton>
        <ToolbarButton disabled>
          <ButtonIcon>↪️</ButtonIcon>
          <ButtonText>Forward</ButtonText>
        </ToolbarButton>
        <Separator />
        <ToolbarButton disabled>
          <ButtonIcon>🗑️</ButtonIcon>
          <ButtonText>Delete</ButtonText>
        </ToolbarButton>
        <Separator />
        <ToolbarButton disabled>
          <ButtonIcon>📤</ButtonIcon>
          <ButtonText>Send/Recv</ButtonText>
        </ToolbarButton>
      </Toolbar>

      <MainContent>
        {view === 'inbox' ? (
          <>
            <Sidebar>
              <FolderTree>
                <FolderItem active>
                  📂 <strong>Outlook Express</strong>
                </FolderItem>
                <FolderItem style={{ paddingLeft: '25px' }} active>
                  📥 Inbox ({testimonials.length})
                </FolderItem>
                <FolderItem style={{ paddingLeft: '25px' }}>
                  📤 Outbox
                </FolderItem>
                <FolderItem style={{ paddingLeft: '25px' }}>
                  📨 Sent Items
                </FolderItem>
                <FolderItem style={{ paddingLeft: '25px' }}>
                  🗑️ Deleted Items
                </FolderItem>
                <FolderItem style={{ paddingLeft: '25px' }}>
                  📝 Drafts
                </FolderItem>
              </FolderTree>

              <ContactInfo>
                <ContactTitle>Quick Contact</ContactTitle>
                <ContactDetail>📧 {resumeData.personal.email}</ContactDetail>
                <ContactDetail>📱 {resumeData.personal.phone}</ContactDetail>
                <ContactDetail>📍 {resumeData.personal.location}</ContactDetail>
              </ContactInfo>
            </Sidebar>

            <ContentArea>
              <MessageList>
                <ListHeader>
                  <HeaderCell width="35%">From</HeaderCell>
                  <HeaderCell width="45%">Subject</HeaderCell>
                  <HeaderCell width="20%">Received</HeaderCell>
                </ListHeader>
                {testimonials.map((msg, i) => (
                  <MessageRow 
                    key={i} 
                    selected={selectedMessage === msg}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <RowCell width="35%">{msg.from}</RowCell>
                    <RowCell width="45%">{msg.subject}</RowCell>
                    <RowCell width="20%">{msg.date}</RowCell>
                  </MessageRow>
                ))}
              </MessageList>

              <PreviewPane>
                <PreviewHeader>
                  <PreviewTitle>{selectedMessage.subject}</PreviewTitle>
                  <PreviewFrom>From: {selectedMessage.from}</PreviewFrom>
                  <PreviewDate>Date: {selectedMessage.date}</PreviewDate>
                </PreviewHeader>
                <PreviewBody>
                  {selectedMessage.body}
                </PreviewBody>
              </PreviewPane>
            </ContentArea>
          </>
        ) : (
          <ComposeArea>
            <ComposeHeader>New Message</ComposeHeader>
            <ComposeForm onSubmit={handleSend}>
              <FormRow>
                <Label>To:</Label>
                <Input value={resumeData.personal.email} readOnly />
              </FormRow>
              <FormRow>
                <Label>From:</Label>
                <Input 
                  type="email"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </FormRow>
              <FormRow>
                <Label>Subject:</Label>
                <Input 
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject"
                  required
                />
              </FormRow>
              <MessageArea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                required
              />
              <ButtonRow>
                <SendButton type="submit" disabled={sending}>
                  {sending ? 'Sending...' : sent ? 'Sent! ✓' : '📤 Send'}
                </SendButton>
                <CancelButton type="button" onClick={() => setView('inbox')}>
                  Cancel
                </CancelButton>
              </ButtonRow>
            </ComposeForm>
            {sent && <SentMessage>✓ Message sent successfully!</SentMessage>}
            {error && <ErrorMessage>✗ {error}</ErrorMessage>}
          </ComposeArea>
        )}
      </MainContent>

      <StatusBar>
        <StatusItem>{testimonials.length} message(s)</StatusItem>
        <StatusItem>|</StatusItem>
        <StatusItem>0 unread</StatusItem>
        <StatusItem style={{ marginLeft: 'auto' }}>
          {resumeData.personal.name} - {resumeData.personal.email}
        </StatusItem>
      </StatusBar>

      {!isFocus && <Overlay />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #ece9d8;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  background: linear-gradient(to bottom, #f1f0e7 0%, #e1ddd9 100%);
  border-bottom: 1px solid #919b9c;
  gap: 2px;
`;

const ToolbarButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  border-radius: 2px;
  
  &:hover:not(:disabled) {
    border: 1px solid #0a246a;
    background: linear-gradient(to bottom, #fefefe 0%, #d6e8ff 100%);
  }
  
  &:active:not(:disabled) {
    background: #c1d2ee;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const ButtonIcon = styled.div`
  font-size: 20px;
  line-height: 1;
`;

const ButtonText = styled.div`
  font-size: 10px;
  margin-top: 2px;
`;

const Separator = styled.div`
  width: 1px;
  height: 32px;
  background: #919b9c;
  margin: 0 4px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 200px;
  background: linear-gradient(to right, #d6dff7 0%, #c3d4f0 100%);
  border-right: 1px solid #919b9c;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const FolderTree = styled.div`
  padding: 8px 0;
`;

const FolderItem = styled.div`
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.5)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const ContactInfo = styled.div`
  margin-top: auto;
  padding: 12px;
  border-top: 1px solid #919b9c;
  background: rgba(255, 255, 255, 0.3);
`;

const ContactTitle = styled.div`
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #0a246a;
`;

const ContactDetail = styled.div`
  font-size: 10px;
  margin-bottom: 4px;
  color: #333;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  height: 40%;
  border-bottom: 3px solid #919b9c;
  overflow-y: auto;
  background: white;
`;

const ListHeader = styled.div`
  display: flex;
  background: linear-gradient(to bottom, #f1f0e7 0%, #e1ddd9 100%);
  border-bottom: 1px solid #919b9c;
  font-size: 11px;
  font-weight: bold;
  padding: 4px 0;
`;

const HeaderCell = styled.div`
  width: ${props => props.width};
  padding: 0 8px;
  border-right: 1px solid #919b9c;
`;

const MessageRow = styled.div`
  display: flex;
  padding: 4px 0;
  font-size: 11px;
  cursor: pointer;
  background: ${props => props.selected ? '#e0e8f6' : 'white'};
  border-bottom: 1px solid #e0e0e0;
  
  &:hover {
    background: #f0f4ff;
  }
`;

const RowCell = styled.div`
  width: ${props => props.width};
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PreviewPane = styled.div`
  flex: 1;
  background: white;
  overflow-y: auto;
  padding: 12px;
`;

const PreviewHeader = styled.div`
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 12px;
`;

const PreviewTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const PreviewFrom = styled.div`
  font-size: 11px;
  margin-bottom: 2px;
`;

const PreviewDate = styled.div`
  font-size: 11px;
  color: #666;
`;

const PreviewBody = styled.div`
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ComposeArea = styled.div`
  flex: 1;
  background: white;
  padding: 12px;
  overflow-y: auto;
`;

const ComposeHeader = styled.h2`
  font-size: 14px;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #0a246a;
`;

const ComposeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  width: 60px;
  font-size: 11px;
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #7f9db9;
  font-size: 11px;
  font-family: 'Tahoma', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #0a246a;
  }
  
  &:read-only {
    background: #f0f0f0;
  }
`;

const MessageArea = styled.textarea`
  min-height: 300px;
  padding: 8px;
  border: 1px solid #7f9db9;
  font-size: 11px;
  font-family: 'Tahoma', sans-serif;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0a246a;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const SendButton = styled.button`
  padding: 6px 20px;
  background: linear-gradient(to bottom, #f1f0e7 0%, #e1ddd9 100%);
  border: 1px solid #0a246a;
  border-radius: 2px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  
  &:hover:not(:disabled) {
    background: linear-gradient(to bottom, #fefefe 0%, #d6e8ff 100%);
  }
  
  &:active:not(:disabled) {
    background: #c1d2ee;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const CancelButton = styled(SendButton)`
  background: linear-gradient(to bottom, #f8f8f8 0%, #e8e8e8 100%);
`;

const SentMessage = styled.div`
  margin-top: 12px;
  padding: 8px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  font-size: 11px;
  border-radius: 2px;
`;

const ErrorMessage = styled.div`
  margin-top: 12px;
  padding: 8px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  font-size: 11px;
  border-radius: 2px;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: #ece9d8;
  border-top: 1px solid #919b9c;
  font-size: 10px;
  color: #000;
`;

const StatusItem = styled.div``;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
`;

export default OutlookExpress;