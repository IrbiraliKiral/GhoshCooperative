import { ContactFormData } from '@/types';

export interface StoredMessage extends ContactFormData {
  id: string;
  timestamp: string;
  status: 'received' | 'read' | 'responded';
}

export interface MessagesDatabase {
  messages: StoredMessage[];
}

/**
 * Load messages from messages.json
 */
export async function loadMessages(): Promise<StoredMessage[]> {
  try {
    const response = await fetch('/messages.json');
    if (!response.ok) {
      console.error('Failed to load messages:', response.statusText);
      return [];
    }
    const data: MessagesDatabase = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

/**
 * Save a new message to messages.json
 * In production, this would send to a backend API
 */
export async function saveMessage(
  formData: ContactFormData
): Promise<{ success: boolean; message?: StoredMessage; error?: string }> {
  try {
    // Generate unique ID and timestamp
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const newMessage: StoredMessage = {
      ...formData,
      id,
      timestamp,
      status: 'received',
    };

    // Load existing messages
    const existingMessages = await loadMessages();

    // Add new message
    const updatedMessages = [...existingMessages, newMessage];

    // Prepare data for saving
    const dataToSave: MessagesDatabase = {
      messages: updatedMessages,
    };

    // In a real application, this would send to a backend API
    // For now, we'll save to localStorage as a fallback
    try {
      localStorage.setItem('messages_backup', JSON.stringify(dataToSave, null, 2));
    } catch (storageError) {
      console.warn('Could not save to localStorage:', storageError);
    }

    return {
      success: true,
      message: newMessage,
    };
  } catch (error) {
    console.error('Error saving message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save message',
    };
  }
}

/**
 * Get all messages
 */
export async function getAllMessages(): Promise<StoredMessage[]> {
  return loadMessages();
}

/**
 * Get messages count
 */
export async function getMessagesCount(): Promise<number> {
  const messages = await loadMessages();
  return messages.length;
}

/**
 * Get message by ID
 */
export async function getMessageById(id: string): Promise<StoredMessage | null> {
  const messages = await loadMessages();
  return messages.find((msg) => msg.id === id) || null;
}

/**
 * Update message status
 */
export async function updateMessageStatus(
  id: string,
  status: 'received' | 'read' | 'responded'
): Promise<{ success: boolean; error?: string }> {
  try {
    const messages = await loadMessages();
    const messageIndex = messages.findIndex((msg) => msg.id === id);

    if (messageIndex === -1) {
      return {
        success: false,
        error: 'Message not found',
      };
    }

    messages[messageIndex].status = status;

    const dataToSave: MessagesDatabase = { messages };
    localStorage.setItem('messages_backup', JSON.stringify(dataToSave, null, 2));

    return { success: true };
  } catch (error) {
    console.error('Error updating message status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update message',
    };
  }
}
