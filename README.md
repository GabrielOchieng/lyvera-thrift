# Lyvera Store

A modern, feature-rich e-commerce platform built with **Next.js 16**, **React 19**, and **PostgreSQL**. Lyvera Store provides a seamless shopping experience with integrated payment processing, AI-powered styling recommendations, WhatsApp integration, and an intuitive admin dashboard.

---

## 🌟 Features

### Customer Features

- **Product Catalog** - Browse products with filtering, search, and detailed product pages
- **Shopping Cart** - Add/remove items, adjust quantities, persistent cart storage
- **Checkout** - Secure checkout with customer information collection
- **Order Tracking** - View order history and status updates
- **AI Stylist** - AI-powered outfit recommendations using Google AI
- **WhatsApp Integration** - Chat with customers via WhatsApp, order updates
- **TikTok Integration** - Products sourced from TikTok with video previews
- **User Authentication** - Secure user registration and login with email verification

### Admin Features

- **Inventory Management** - Add, edit, delete products with stock tracking
- **Order Management** - View and manage all customer orders
- **User Management** - Manage user accounts and permissions
- **Dashboard Analytics** - Revenue charts and inventory statistics
- **Cron Jobs** - Automated order processing and cleanup

### Payment Integration

- **M-Pesa** - Mobile money payment processing
- **PesaPal** - Alternative payment gateway integration

### Technical Features

- **Server-Side Rendering** - Optimized performance with Next.js App Router
- **Database ORM** - Prisma with PostgreSQL
- **Authentication** - Better Auth for secure session management
- **File Upload** - Cloudinary and UploadThing integration
- **Email Service** - Resend for transactional emails
- **Analytics** - Vercel Analytics integration

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) 16.1.6
- **React**: 19.2.3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **Forms**: Zod for schema validation
- **State Management**: [Zustand](https://zustand-demo.vercel.app/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: Lucide React, React Icons

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js (API Routes)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) 7.8.0
- **Authentication**: [Better Auth](https://better-auth.com/) 1.5.5
- **Email**: [Resend](https://resend.com/)
- **AI**: [Google Generative AI](https://ai.google.dev/)
- **File Storage**: Cloudinary, UploadThing

### Development Tools

- **Language**: TypeScript
- **Linting**: ESLint 9
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm
- **Deployment**: Vercel

---

## 📁 Project Structure

```
lyvera-store/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (shop)/            # Customer-facing routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout page
│   │   │   ├── orders/        # Order history
│   │   │   ├── profile/       # User profile
│   │   │   └── shop/          # Product catalog
│   │   ├── admin/             # Admin routes (protected)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── inventory/     # Product management
│   │   │   ├── orders/        # Order management
│   │   │   └── users/         # User management
│   │   ├── api/               # API endpoints
│   │   │   ├── auth/          # Authentication
│   │   │   ├── checkout/      # Checkout processing
│   │   │   ├── products/      # Product operations
│   │   │   ├── orders/        # Order operations
│   │   │   ├── stylist/       # AI stylist
│   │   │   ├── webhook/       # Payment webhooks
│   │   │   ├── cron/          # Scheduled tasks
│   │   │   ├── analyze-image/ # Image analysis
│   │   │   └── generate-video/# Video generation
│   │   ├── auth/              # Auth pages (login, signup, etc.)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── actions/               # Server actions
│   │   ├── newsletter.ts      # Newsletter subscription
│   │   ├── order.ts           # Order operations
│   │   ├── product.ts         # Product operations
│   │   └── users.ts           # User operations
│   ├── components/            # React components
│   │   ├── ai/                # AI-related components
│   │   ├── auth/              # Authentication forms
│   │   ├── cart/              # Cart-related components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── order/             # Order components
│   │   ├── Inventory/         # Inventory components
│   │   ├── ui/                # shadcn/ui components
│   │   └── *.tsx              # Shared components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions & config
│   │   ├── auth.ts            # Auth configuration
│   │   ├── auth-client.ts     # Client-side auth
│   │   ├── db-utils.ts        # Database utilities
│   │   ├── mpesa.ts           # M-Pesa integration
│   │   ├── pesapal.ts         # PesaPal integration
│   │   ├── schema.ts          # Validation schemas
│   │   ├── whatsapp/          # WhatsApp integration
│   │   └── utils.ts           # General utilities
│   ├── proxy.ts               # Proxy configuration
│   └── scripts/               # Import scripts
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── scripts/                   # Utility scripts
├── components.json            # shadcn/ui config
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.mjs         # PostCSS configuration
├── eslint.config.mjs          # ESLint configuration
├── prisma.config.ts           # Prisma configuration
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies & scripts
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 13+ database
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/lyvera-store.git
cd lyvera-store
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lyvera_store"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Google AI (for AI Stylist)
GOOGLE_API_KEY="your-google-api-key"

# Payment Processors
MPESA_CONSUMER_KEY="your-mpesa-key"
MPESA_CONSUMER_SECRET="your-mpesa-secret"
MPESA_PASSKEY="your-mpesa-passkey"

PESAPAL_CONSUMER_KEY="your-pesapal-key"
PESAPAL_CONSUMER_SECRET="your-pesapal-secret"

# File Storage
CLOUDINARY_URL="cloudinary://key:secret@cloud"
UPLOADTHING_TOKEN="your-uploadthing-token"

# Email Service
RESEND_API_KEY="your-resend-api-key"

# WhatsApp
WHATSAPP_BUSINESS_ACCOUNT_ID="your-whatsapp-account-id"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_API_TOKEN="your-whatsapp-api-token"

# TikTok
TIKTOK_API_KEY="your-tiktok-api-key"

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
```

4. **Set up the database**

```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Build for production (generates Prisma client)
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

---

## 🔧 Configuration

### Environment Variables

| Variable             | Description                       | Required                 |
| -------------------- | --------------------------------- | ------------------------ |
| `DATABASE_URL`       | PostgreSQL connection string      | ✅                       |
| `BETTER_AUTH_SECRET` | Session encryption secret         | ✅                       |
| `BETTER_AUTH_URL`    | Authentication URL                | ✅                       |
| `GOOGLE_API_KEY`     | Google Generative AI API key      | For AI Stylist           |
| `MPESA_*`            | M-Pesa credentials                | For M-Pesa payments      |
| `PESAPAL_*`          | PesaPal credentials               | For PesaPal payments     |
| `CLOUDINARY_URL`     | Cloudinary integration URL        | For image upload         |
| `UPLOADTHING_TOKEN`  | UploadThing API token             | For file upload          |
| `RESEND_API_KEY`     | Resend email service key          | For emails               |
| `WHATSAPP_*`         | WhatsApp Business API credentials | For WhatsApp integration |
| `TIKTOK_API_KEY`     | TikTok API key                    | For TikTok integration   |

---

## 🗄️ Database Schema

The application uses **Prisma ORM** with the following main models:

- **User** - Customer and admin user accounts
- **Session** - User authentication sessions
- **Account** - Third-party account integrations
- **Product** - E-commerce products with images and metadata
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Individual items in orders
- **UserSession** - WhatsApp user sessions
- **ChatSession** - AI chat sessions
- **Verification** - Email verification tokens

View the complete schema in [`prisma/schema.prisma`](./prisma/schema.prisma).

---

## 🔐 Authentication

This project uses [Better Auth](https://better-auth.com/) for secure authentication:

- Email/password authentication
- Session management with JWT tokens
- Email verification
- Password reset flow
- Account linking support

User roles are supported (user, admin) for role-based access control.

---

## 💳 Payment Processing

### M-Pesa

Mobile money payment processing with real-time transaction verification.

- Integration in [`src/lib/mpesa.ts`](./src/lib/mpesa.ts)
- Webhook handling in `/api/webhook`

### PesaPal

Alternative payment gateway integration.

- Integration in [`src/lib/pesapal.ts`](./src/lib/pesapal.ts)
- Webhook handling in `/api/webhook`

---

## 🤖 AI Features

### AI Stylist

AI-powered outfit recommendations using Google Generative AI.

- Component: [`src/components/ai/AiStylist.tsx`](./src/components/ai/AiStylist.tsx)
- API: `/api/stylist`

### Image Analysis

Analyze product images for styling recommendations.

- API: `/api/analyze-image`

### Video Generation

Generate videos for product showcases.

- API: `/api/generate-video`

---

## 💬 WhatsApp Integration

Integrate with customers via WhatsApp Business API:

- Customer chat support
- Order status notifications
- Cart management via chat
- Multi-language support

Located in [`src/lib/whatsapp/`](./src/lib/whatsapp/).

---

## 📱 TikTok Integration

Import trending products from TikTok:

- Automatic product import from TikTok links
- Video preview integration
- Script: [`scripts/import-tiktok.ts`](./scripts/import-tiktok.ts)

---

## 📊 Admin Dashboard

Comprehensive admin panel with:

- **Dashboard** - Overview with revenue and inventory charts
- **Inventory** - Add/edit/delete products with stock management
- **Orders** - Track and manage customer orders
- **Users** - Manage user accounts and permissions
- **Analytics** - Revenue trends and inventory statistics

Access at `/admin` (admin role required).

---

## 🔄 Cron Jobs

Automated tasks configured in [`vercel.json`](./vercel.json):

- **Daily Order Release** - Release pending orders at midnight (UTC)
  - Endpoint: `/api/cron/release-orders`
  - Schedule: `0 0 * * *`

---

## 📧 Email Service

Email notifications via [Resend](https://resend.com/):

- Welcome emails
- Order confirmation
- Password reset
- Newsletter

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start the server
npm start
```

The application will run on `http://localhost:3000`.

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Products

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders

- `POST /api/checkout` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/webhook` - Payment webhook handling

### AI Features

- `POST /api/stylist` - Get style recommendations
- `POST /api/analyze-image` - Analyze product image

---

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Build and check for errors
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For support, please:

- Open an issue on GitHub
- Contact via WhatsApp (if integrated)
- Email support

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Loyalty rewards program
- [ ] Advanced search filters
- [ ] Product reviews and ratings
- [ ] Live chat support
- [ ] SMS notifications
- [ ] Subscription products
- [ ] Marketplace for sellers

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Prisma](https://www.prisma.io/) for database ORM
- [Vercel](https://vercel.com/) for hosting
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ by the Lyvera Team**
