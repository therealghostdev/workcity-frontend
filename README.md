# Workcity Chat Application - Frontend

A modern, real-time chat application built with Next.js, TypeScript, and Tailwind CSS for the Workcity full-stack developer assessment. This frontend provides a professional chat interface with user authentication, role-based access, and real-time messaging capabilities.

## 🚀 Features

### Core Functionality

- **User Authentication**: JWT-based login/register system with role-based access control
- **Real-time Chat**: Socket.IO integration for instant messaging
- **User Roles**: Support for Customer, Agent, Designer, Merchant, and Admin roles
- **Profile Management**: User profile editing and account settings
- **Admin Dashboard**: Administrative interface with user management (admin-only access)
- **Conversation Management**: Create new conversations and manage existing chats
- **User Discovery**: Find and connect with other users in the system
- **Responsive Design**: Mobile-first approach with clean, professional UI

### Pages & Navigation

- **Login/Register**: Authentication pages with role selection
- **Chat Interface**: Main chat application with conversation sidebar
- **Profile Page**: User profile management and account settings
- **Admin Dashboard**: User management, system statistics, and monitoring (admin role required)
- **Navigation Bar**: Role-based navigation with user dropdown menu

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **Modern UI Components**: Built with shadcn/ui component library
- **Real-time Updates**: Live message delivery and typing indicators
- **Role-based Access Control**: Different UI elements and pages based on user roles
- **Demo Mode**: Fallback functionality for testing without backend connection
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth UX with proper loading indicators

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: JWT tokens with localStorage
- **Routing**: Next.js App Router with role-based access control

## 📁 Project Structure

\`\`\`
├── app/
│ ├── admin/ # Admin dashboard (admin-only)
│ ├── chat/ # Chat interface pages
│ ├── login/ # Authentication pages
│ ├── profile/ # User profile management
│ ├── layout.tsx # Root layout with providers
│ ├── page.tsx # Landing page
│ └── globals.css # Global styles
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── demo-banner.tsx # Demo mode indicator
│ ├── navigation.tsx # Main navigation component
│ └── user-discovery.tsx # User search and discovery
├── lib/
│ ├── api.ts # API client and type definitions
│ ├── socket.ts # Socket.IO configuration
│ └── utils.ts # Utility functions
└── backend/ # Backend code (separate deployment)
\`\`\`

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Backend API running (see backend folder)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd workcity-chat-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install

   # or

   pnpm install
   \`\`\`

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev

   # or

   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:5000)

### Backend Integration

The frontend expects the backend to be running on the configured API URL. The backend should provide:

- Authentication endpoints (`/api/auth/login`, `/api/auth/register`)
- User management (`/api/users`)
- Conversation management (`/api/conversations`)
- Message handling (`/api/messages`)
- Socket.IO server for real-time features

## 🎯 Usage

### Authentication

1. Navigate to `/login`
2. Register a new account or login with existing credentials
3. Select your role (Customer, Agent, Designer, Merchant, Admin)
4. Access the main application

### Navigation & Pages

- **Chat**: Main messaging interface with conversation management
- **Profile**: Edit personal information, view account details
- **Admin Dashboard**: User management and system monitoring (admin users only)
- **User Menu**: Access profile, admin features, and logout from the navigation bar

### Chat Features

1. **View Conversations**: See all your active conversations in the sidebar
2. **Start New Chat**: Click "Start New Chat" to find and message other users
3. **Send Messages**: Type and send messages in real-time
4. **User Discovery**: Search for users by name or role to start conversations

### Profile Management

1. **Edit Profile**: Update personal information like name, phone, location
2. **View Account Info**: See account creation date, role, and status
3. **Role Display**: Visual role badges and permissions

### Admin Features (Admin Role Only)

1. **User Management**: View all users, filter by role and status
2. **System Statistics**: Monitor total users, active conversations, messages
3. **User Search**: Find specific users by username or email
4. **Access Control**: Automatic redirection for non-admin users

### Demo Mode

When the backend is not connected, the application runs in demo mode with:

- Mock conversations and messages
- Simulated user interactions
- Demo response generation for testing
- Sample user data for profile and admin pages

## 🐛 Development Challenges & Solutions

### Challenge 1: API Response Type Inconsistencies

**Problem**: Initial implementation had mismatched TypeScript interfaces between frontend expectations and backend responses, causing `Property 'data' does not exist` errors.

**Solution**:

- Analyzed actual backend response structure
- Updated `ApiResponse<T>` interface to match backend format
- Ensured consistent data handling across all API calls
- Added proper type definitions for User, Message, and Conversation objects

### Challenge 2: Non-functional Chat Interface

**Problem**: Users couldn't actually test the chat functionality - the "Start New Chat" button was non-functional, and there were no default users or conversations to interact with.

**Solution**:

- Implemented functional UserDiscovery component with user search
- Added demo data and mock responses for testing without backend
- Created proper conversation creation flow
- Added realistic demo message responses to simulate chat interactions

### Challenge 3: Role-based Access Control Implementation

**Problem**: Need to implement proper access control for admin dashboard while maintaining good UX for different user roles.

**Solution**:

- Created role-based navigation component that shows/hides menu items
- Implemented server-side access checks in admin dashboard
- Added proper error handling and redirection for unauthorized access
- Used localStorage to persist user role information

### Challenge 4: Missing Required Pages

**Problem**: Assessment required profile and admin dashboard pages that weren't initially implemented.

**Solution**:

- Built comprehensive profile page with editable user information
- Created full-featured admin dashboard with user management
- Added proper navigation between all pages
- Implemented role-based UI elements and access control

### Challenge 5: User Experience During Development

**Problem**: Lack of immediate feedback and testing capabilities made development iteration slow and frustrating.

**Solution**:

- Added comprehensive demo mode with realistic data
- Implemented proper loading states and error handling
- Created visual indicators for demo vs. live mode
- Added immediate UI feedback for all user actions

## 🔍 API Integration

### Authentication Flow

\`\`\`typescript
// Login
const response = await apiClient.login(email, password);
localStorage.setItem('token', response.token);

// Register
const response = await apiClient.register(email, password, name, role);
\`\`\`

### Chat Operations

\`\`\`typescript
// Get conversations
const conversations = await apiClient.getConversations();

// Send message
const message = await apiClient.sendMessage(conversationId, content);

// Create conversation
const conversation = await apiClient.createConversation(participantId);
\`\`\`

### User Management

\`\`\`typescript
// Get all users (admin only)
const users = await apiClient.getUsers();

// Update profile
const updatedUser = await apiClient.updateProfile(profileData);
\`\`\`

### Real-time Events

\`\`\`typescript
// Join conversation
socket.emit('join_conversation', conversationId);

// Send message
socket.emit('send_message', { conversationId, content });

// Listen for messages
socket.on('new_message', (message) => {
// Update UI with new message
});
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 🧪 Testing

### Demo Mode Testing

1. Run the application without backend connection
2. Login with any credentials (demo mode)
3. Test all pages: chat, profile, admin dashboard
4. Verify role-based access control works
5. Test all UI interactions and navigation

### Full Integration Testing

1. Ensure backend is running
2. Test complete authentication flow
3. Create real conversations and send messages
4. Verify real-time message delivery
5. Test profile updates and admin features

## 📝 Future Enhancements

- [ ] Message encryption for security
- [ ] File and image sharing capabilities
- [ ] Push notifications for new messages
- [ ] Advanced user search and filtering
- [ ] Message history and pagination
- [ ] Typing indicators and read receipts
- [ ] Group chat functionality
- [ ] Enhanced admin dashboard with analytics
- [ ] Dark/light mode toggle
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Workcity technical assessment and is intended for evaluation purposes.

## 🆘 Support

For technical issues or questions about this implementation, please refer to the development documentation or contact the development team.

---

**Note**: This frontend is designed to work with the corresponding Node.js/Express/MongoDB backend. Ensure both applications are properly configured and running for full functionality.
