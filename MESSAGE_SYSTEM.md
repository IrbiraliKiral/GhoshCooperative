# Message System Documentation

## Overview

The Message System allows users to submit contact form messages that are automatically saved to `messages.json` in the root directory. When a user submits a message, they are prompted with a confirmation modal to review their details before sending.

## Architecture

### Files Structure

```
├── messages.json                          # Message storage (root level)
├── src/
│   ├── services/
│   │   └── messageService.ts             # Message CRUD operations
│   ├── hooks/
│   │   └── useMessage.ts                 # React hook for message submission
│   ├── components/
│   │   ├── common/
│   │   │   └── ConfirmationModal/
│   │   │       └── ConfirmationModal.tsx # Confirmation modal component
│   │   └── forms/
│   │       └── ContactForm/
│   │           └── ContactForm.tsx       # Updated contact form with modal
```

## Components

### 1. ConfirmationModal Component

**Location:** `src/components/common/ConfirmationModal/ConfirmationModal.tsx`

A reusable modal component for confirming user actions before submission.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `title: string` - Modal title
- `message: string` - Main message content
- `subtitle?: string` - Optional subtitle
- `confirmText?: string` - Text for confirm button (default: "Confirm")
- `cancelText?: string` - Text for cancel button (default: "Cancel")
- `isLoading?: boolean` - Shows loading state (default: false)
- `isDangerous?: boolean` - Applies red styling for destructive actions (default: false)
- `onConfirm: () => void | Promise<void>` - Callback when confirmed
- `onCancel: () => void` - Callback when cancelled
- `icon?: 'warning' | 'info' | 'success'` - Icon type (default: 'info')

**Features:**
- Backdrop click to dismiss (when not loading)
- Escape key support
- Loading spinner on confirm button
- Customizable styling for different action types
- Smooth animations
- Prevents body scroll when open

### 2. useMessage Hook

**Location:** `src/hooks/useMessage.ts`

Custom React hook for handling message submission and state management.

**Return Object:**
```typescript
{
  isSubmitting: boolean;           // Whether message is being submitted
  error: string | null;            // Error message if any
  lastMessage: StoredMessage | null; // Last submitted message
  submitMessage: (data: ContactFormData) => Promise<{ success: boolean; message?: StoredMessage; error?: string }>;
  clearError: () => void;          // Clear error state
  clearLastMessage: () => void;    // Clear last message state
}
```

**Usage:**
```typescript
const { submitMessage, isSubmitting, error } = useMessage();

const handleSubmit = async (formData) => {
  const result = await submitMessage(formData);
  if (result.success) {
    console.log('Message saved:', result.message);
  }
};
```

### 3. Message Service

**Location:** `src/services/messageService.ts`

Service layer for message operations (CRUD operations).

**Functions:**

#### `saveMessage(formData: ContactFormData)`
Saves a new message to messages.json

```typescript
const result = await saveMessage({
  email: 'user@example.com',
  phone: '+91-1234567890',
  message: 'Hello, I need help...'
});

if (result.success) {
  console.log('Message ID:', result.message?.id);
}
```

#### `loadMessages()`
Loads all messages from messages.json

```typescript
const messages = await loadMessages();
console.log(`Found ${messages.length} messages`);
```

#### `getMessagesCount()`
Gets the total count of messages

```typescript
const count = await getMessagesCount();
console.log(`Total messages: ${count}`);
```

#### `getMessageById(id: string)`
Retrieves a specific message by ID

```typescript
const message = await getMessageById('msg_123456_abc789');
if (message) {
  console.log(message.email);
}
```

#### `updateMessageStatus(id: string, status: 'received' | 'read' | 'responded')`
Updates the status of a message

```typescript
await updateMessageStatus('msg_123456_abc789', 'read');
```

### 4. ContactForm Component (Updated)

**Location:** `src/components/forms/ContactForm/ContactForm.tsx`

Enhanced contact form with confirmation modal integration.

**Flow:**
1. User fills in form fields (email, phone, message)
2. Form is validated on blur and submission
3. When submit button is clicked, confirmation modal appears
4. User reviews their details in the modal
5. If confirmed, message is saved to messages.json
6. Success toast notification is shown
7. Form is reset

**Key Changes:**
- Added `useMessage` hook for message submission
- Added state management for confirmation modal
- Integrated `ConfirmationModal` component
- Messages are now saved with unique IDs and timestamps
- All form fields are disabled while submission is in progress

## Message Storage Format

Messages are stored in `messages.json` with the following structure:

```json
{
  "messages": [
    {
      "id": "msg_1704067200000_a1b2c3d4e",
      "email": "user@example.com",
      "phone": "+91-1234567890",
      "message": "Hello, I have a question about your services.",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "status": "received"
    }
  ]
}
```

### Message Fields

- **id**: Unique identifier (format: `msg_${timestamp}_${random}`)
- **email**: User's email address
- **phone**: User's phone number
- **message**: User's message content
- **timestamp**: ISO 8601 timestamp when message was received
- **status**: Message status ('received' | 'read' | 'responded')

## Backup Storage

In addition to saving to `messages.json`, messages are also backed up to localStorage under the key `messages_backup`. This provides redundancy in case the JSON file is unavailable.

**Accessing backup:**
```typescript
const backup = JSON.parse(localStorage.getItem('messages_backup') || '{"messages":[]}');
console.log(backup.messages);
```

## Usage Examples

### Example 1: Basic Message Submission

```typescript
import { ContactForm } from '@/components/forms/ContactForm/ContactForm';

export function MyPage() {
  return <ContactForm />;
}
```

### Example 2: Using useMessage Hook Directly

```typescript
import { useMessage } from '@/hooks/useMessage';

export function MyComponent() {
  const { submitMessage, isSubmitting, error } = useMessage();

  const handleSubmit = async () => {
    const result = await submitMessage({
      email: 'test@example.com',
      phone: '+91-9876543210',
      message: 'Test message'
    });

    if (result.success) {
      console.log('Message saved successfully');
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Send Message'}
    </button>
  );
}
```

### Example 3: Reading Saved Messages

```typescript
import { getAllMessages, getMessagesCount } from '@/services/messageService';

async function viewMessages() {
  const count = await getMessagesCount();
  console.log(`Total messages: ${count}`);

  const messages = await getAllMessages();
  messages.forEach(msg => {
    console.log(`[${msg.timestamp}] ${msg.email}: ${msg.message}`);
  });
}
```

### Example 4: Using Confirmation Modal Independently

```typescript
import { ConfirmationModal } from '@/components/common/ConfirmationModal/ConfirmationModal';
import { useState } from 'react';

export function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async () => {
    console.log('User confirmed action');
    await new Promise(r => setTimeout(r, 1000));
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Delete Item
      </button>

      <ConfirmationModal
        isOpen={showModal}
        title="Delete Item?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Keep"
        isDangerous={true}
        icon="warning"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
```

## Data Flow

```
User submits form
        ↓
Form validates input
        ↓
Confirmation modal opens
        ↓
User reviews details
        ↓
User clicks "Send Message"
        ↓
Message is sanitized
        ↓
Message is saved to messages.json
        ↓
Backup is saved to localStorage
        ↓
Success notification shown
        ↓
Form is reset
```

## Error Handling

The system handles various error scenarios:

1. **Validation Errors**: Form field validation before submission
2. **Service Errors**: Caught and displayed in error state
3. **Storage Errors**: Logged but don't prevent success notification
4. **Network Errors**: Handled gracefully with fallback to localStorage

## Best Practices

1. **Always sanitize form data** before submission using `sanitizeFormData()`
2. **Check `isSubmitting` state** to prevent double submissions
3. **Display error messages** to users for failed submissions
4. **Use timestamps** for audit trails
5. **Update message status** when messages are reviewed or responded to
6. **Back up messages regularly** from messages.json

## Future Enhancements

1. **Database Integration**: Replace file storage with proper database
2. **Admin Dashboard**: View and manage messages through UI
3. **Email Notifications**: Send email alerts for new messages
4. **Message Search**: Search messages by email, phone, or date
5. **Bulk Actions**: Delete or update multiple messages
6. **Export to CSV**: Export messages for reporting
7. **Rate Limiting**: Prevent spam submissions
8. **Attachment Support**: Allow file uploads with messages

## Testing

### Test Message Submission

1. Navigate to the contact form on the landing page
2. Fill in all required fields (email, phone, message)
3. Click "Send Message"
4. Review details in the confirmation modal
5. Click "Send Message" in the modal
6. Verify success notification appears
7. Check `messages.json` for the new message
8. Check `localStorage['messages_backup']` for the backup

### Test Error Handling

1. Try submitting with invalid email format
2. Try submitting with invalid phone number
3. Try submitting with message less than 10 characters
4. Verify appropriate error messages appear

## Troubleshooting

### Messages not saving

1. Check browser console for errors
2. Verify `messages.json` exists in root directory
3. Check browser localStorage for backup: `localStorage.getItem('messages_backup')`
4. Ensure file permissions allow writing to `messages.json`

### Modal not closing

1. Check for JavaScript errors in console
2. Verify `onConfirm` callback is completing
3. Check network tab for failed API calls (if using backend)

### Confirmation modal not appearing

1. Verify `ConfirmationModal` is imported correctly
2. Check that form submission is working
3. Verify state management is correct in `ContactForm`

## API Reference

### saveMessage

```typescript
function saveMessage(formData: ContactFormData): Promise<{
  success: boolean;
  message?: StoredMessage;
  error?: string;
}>
```

### loadMessages

```typescript
function loadMessages(): Promise<StoredMessage[]>
```

### getAllMessages

```typescript
function getAllMessages(): Promise<StoredMessage[]>
```

### getMessagesCount

```typescript
function getMessagesCount(): Promise<number>
```

### getMessageById

```typescript
function getMessageById(id: string): Promise<StoredMessage | null>
```

### updateMessageStatus

```typescript
function updateMessageStatus(
  id: string,
  status: 'received' | 'read' | 'responded'
): Promise<{ success: boolean; error?: string }>
```

---

## Summary

The Message System provides a complete solution for:
- ✅ Accepting contact form submissions
- ✅ Confirming submissions with a modal
- ✅ Saving messages with unique IDs and timestamps
- ✅ Backing up to localStorage
- ✅ Retrieving and managing messages
- ✅ Updating message status
- ✅ Handling errors gracefully

This system can be easily extended to integrate with a backend API or database in the future.
