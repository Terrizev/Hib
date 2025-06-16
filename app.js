document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const fileButton = document.getElementById('file-button');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    const chatMessages = document.querySelector('.chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const chatHistoryItems = document.querySelectorAll('.chat-history .chat-item');

    // Configuration
    const BACKEND_ENDPOINT = 'https://api.dreaded.site/api/chatgpt?text='; // Replace with your actual backend endpoint
    let currentFile = null;

    // Initialize
    setupEventListeners();
    autoResizeTextarea();

    function setupEventListeners() {
        // Message input
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Send button
        sendButton.addEventListener('click', sendMessage);

        // File handling
        fileButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        removeFile.addEventListener('click', clearFile);

        // Chat history navigation
        chatHistoryItems.forEach(item => {
            item.addEventListener('click', function() {
                chatHistoryItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                // Here you would load the selected conversation
            });
        });
    }

    function autoResizeTextarea() {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    function handleFileSelect(event) {
        if (event.target.files && event.target.files.length > 0) {
            currentFile = event.target.files[0];
            fileName.textContent = currentFile.name;
            fileUpload.style.display = 'flex';
        }
    }

    function clearFile() {
        currentFile = null;
        fileInput.value = '';
        fileUpload.style.display = 'none';
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message && !currentFile) return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        messageInput.value = '';
        clearFile();
        resetTextareaHeight();

        // Show typing indicator
        showTypingIndicator();

        try {
            // Prepare request data
            const formData = new FormData();
            formData.append('message', message);
            if (currentFile) {
                formData.append('file', currentFile);
            }

            // Simulate API delay for demo (remove in production)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real implementation, you would:
            // const response = await fetch(BACKEND_ENDPOINT, {
            //     method: 'POST',
            //     body: formData
            // });
            // const data = await response.json();
            
            // For demo purposes, we'll use a mock response
            const mockResponse = {
                success: true,
                reply: `I received your ${currentFile ? 'file (' + currentFile.name + ') and ' : ''}message: "${message}". In a real implementation, this would be the API response.`
            };

            // Add bot response to chat
            addMessageToChat(mockResponse.reply, 'bot');
            
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat("Sorry, I encountered an error processing your request.", 'bot');
        } finally {
            hideTypingIndicator();
            scrollToBottom();
        }
    }

    function addMessageToChat(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `message-content ${sender}-message`;
        messageContent.innerHTML = content;
        
        // Add timestamp
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = `Today, ${timeString}`;
        
        messageContent.appendChild(timeDiv);
        messageDiv.appendChild(messageContent);
        
        // Add to chat with animation
        messageDiv.style.opacity = '0';
        chatMessages.appendChild(messageDiv);
        
        // Trigger animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10);
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function resetTextareaHeight() {
        messageInput.style.height = 'auto';
    }

    // Demo conversation loader
    function loadConversation(conversationId) {
        // In a real implementation, you would fetch the conversation history
        console.log(`Loading conversation ${conversationId}`);
    }
});