STORE/
├── README.md
├── package.json
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── apps/
│   ├── backend/             # NestJS API
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── main.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── database.config.ts
│   │   │   │   ├── cloudinary.config.ts
│   │   │   │   ├── email.config.ts
│   │   │   │   ├── jwt.config.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── roles.decorator.ts
│   │   │   │   │   └── public.decorator.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   └── jwt-auth.guard.ts
│   │   │   │   ├── filters/
│   │   │   │   │   └── http-exception.filter.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── transform.interceptor.ts
│   │   │   │   │   └── logging.interceptor.ts
│   │   │   │   └── middlewares/
│   │   │   │       └── logger.middleware.ts
│   │   │   │
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   │   ├── register.dto.ts
│   │   │   │   │   │   ├── auth-response.dto.ts
│   │   │   │   │   │   └── verify-otp.dto.ts
│   │   │   │   │   └── strategies/
│   │   │   │   │       ├── jwt.strategy.ts
│   │   │   │   │       └── local.strategy.ts
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── user.entity.ts
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.service.ts
│   │   │   │   │   ├── users.module.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-user.dto.ts
│   │   │   │   │   │   ├── update-user.dto.ts
│   │   │   │   │   │   └── change-password.dto.ts
│   │   │   │   │   └── enums/
│   │   │   │   │       └── user-role.enum.ts
│   │   │   │   │
│   │   │   │   ├── products/
│   │   │   │   │   ├── product.entity.ts                # UPDATED (added transformer)
│   │   │   │   │   ├── products.controller.ts           # UPDATED (added update/delete endpoints)
│   │   │   │   │   ├── products.service.ts              # UPDATED (added cloudinary service)
│   │   │   │   │   ├── products.module.ts               # UPDATED (added CloudinaryService)
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-product.dto.ts
│   │   │   │   │   │   ├── update-product.dto.ts
│   │   │   │   │   │   └── product-filter.dto.ts
│   │   │   │   │   └── interfaces/
│   │   │   │   │       └── product.interface.ts
│   │   │   │   │
│   │   │   │   ├── categories/
│   │   │   │   │   ├── category.entity.ts
│   │   │   │   │   ├── categories.controller.ts
│   │   │   │   │   ├── categories.service.ts
│   │   │   │   │   ├── categories.module.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── create-category.dto.ts
│   │   │   │   │       └── update-category.dto.ts
│   │   │   │   │
│   │   │   │   ├── orders/
│   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   ├── orders.controller.ts
│   │   │   │   │   ├── orders.service.ts
│   │   │   │   │   ├── orders.module.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-order.dto.ts
│   │   │   │   │   │   └── update-order.dto.ts
│   │   │   │   │   └── enums/
│   │   │   │   │       └── order-status.enum.ts
│   │   │   │   │
│   │   │   │   ├── uploads/
│   │   │   │   │   ├── uploads.controller.ts
│   │   │   │   │   ├── uploads.service.ts
│   │   │   │   │   ├── uploads.module.ts
│   │   │   │   │   ├── cloudinary.service.ts            # NEW
│   │   │   │   │   └── dto/
│   │   │   │   │       └── file-upload.dto.ts
│   │   │   │   │
│   │   │   │   ├── admin/
│   │   │   │   │   ├── admin.controller.ts
│   │   │   │   │   ├── admin.service.ts
│   │   │   │   │   ├── admin.module.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       └── stats.dto.ts
│   │   │   │   │
│   │   │   │   └── email/
│   │   │   │       ├── email.service.ts
│   │   │   │       └── email.module.ts
│   │   │   │
│   │   │   ├── uploads/
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   │   └── AddEmailVerificationColumns.ts
│   │   │   │   ├── seeds/
│   │   │   │   │   └── admin.seed.ts
│   │   │   │   └── typeorm.config.ts
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── constants.ts
│   │   │       ├── helpers.ts
│   │   │       └── validators/
│   │   │           └── password.validator.ts
│   │   │
│   │   ├── test/
│   │   ├── .env
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── test-api.js
│   │
│   └── frontend/            # Next.js (App Router)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── globals.css
│       │   │   │
│       │   │   ├── admin/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── dashboard/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── products/
│       │   │   │   │   ├── page.tsx                     # UPDATED (full API integration)
│       │   │   │   │   └── create/
│       │   │   │   │       └── page.tsx
│       │   │   │   ├── edit/                           # NEW FOLDER
│       │   │   │   │   └── [id]/
│       │   │   │   │       └── page.tsx                # NEW (Edit product page)
│       │   │   │   ├── orders/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── users/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── analytics/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── settings/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── categories/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   ├── login/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── layout.tsx
│       │   │   │   ├── register/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── layout.tsx
│       │   │   │   └── verify-email/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── dashboard/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── orders/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── profile/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── settings/
│       │   │   │       └── page.tsx
│       │   │   │
│       │   │   ├── products/                           # NEW FOLDER
│       │   │   │   ├── page.tsx
│       │   │   │   ├── layout.tsx
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx                   # NEW (Product detail page)
│       │   │   │
│       │   │   ├── cart/
│       │   │   │   └── page.tsx
│       │   │   │
│       │   │   └── api/
│       │   │       └── auth/[...nextauth]/
│       │   │           └── route.ts
│       │   │
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── Button.tsx                     # NEW
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Card.tsx                       # NEW (with CardContent, CardHeader, CardTitle)
│       │   │   │   ├── Modal.tsx
│       │   │   │   ├── Table.tsx
│       │   │   │   ├── Dropdown.tsx
│       │   │   │   ├── Badge.tsx
│       │   │   │   ├── Alert.tsx
│       │   │   │   ├── Loader.tsx
│       │   │   │   └── OtpInput.tsx
│       │   │   │
│       │   │   ├── forms/
│       │   │   │   ├── LoginForm.tsx
│       │   │   │   ├── RegisterForm.tsx
│       │   │   │   ├── VerifyOtpForm.tsx
│       │   │   │   ├── ProductForm.tsx
│       │   │   │   ├── CategoryForm.tsx
│       │   │   │   └── ProfileForm.tsx
│       │   │   │
│       │   │   ├── layout/
│       │   │   │   ├── Header.tsx
│       │   │   │   ├── Footer.tsx
│       │   │   │   ├── Sidebar.tsx
│       │   │   │   ├── AdminSidebar.tsx
│       │   │   │   └── DashboardLayout.tsx
│       │   │   │
│       │   │   ├── products/
│       │   │   │   ├── ProductCard.tsx
│       │   │   │   ├── ProductList.tsx
│       │   │   │   ├── ProductFilters.tsx
│       │   │   │   └── ProductDetail.tsx              # NEW (Product detail component)
│       │   │   │
│       │   │   ├── cart/
│       │   │   │   ├── CartItem.tsx
│       │   │   │   ├── CartSummary.tsx
│       │   │   │   └── CheckoutForm.tsx
│       │   │   │
│       │   │   ├── admin/
│       │   │   │   ├── AdminSidebar.tsx
│       │   │   │   ├── StatsCards.tsx
│       │   │   │   ├── RecentOrders.tsx
│       │   │   │   ├── ProductTable.tsx
│       │   │   │   ├── UserTable.tsx
│       │   │   │   └── OrderTable.tsx
│       │   │   │
│       │   │   └── shared/
│       │   │       ├── ProtectedRoute.tsx
│       │   │       ├── LoadingSpinner.tsx
│       │   │       └── ErrorBoundary.tsx
│       │   │
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   ├── auth.tsx
│       │   │   ├── constants.ts
│       │   │   └── utils.ts
│       │   │
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useCart.ts
│       │   │   ├── useProducts.ts
│       │   │   ├── useOrders.ts
│       │   │   └── useAdmin.ts
│       │   │
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── product.service.ts                  # UPDATED (added update/delete methods)
│       │   │   ├── order.service.ts
│       │   │   ├── category.service.ts
│       │   │   ├── upload.service.ts
│       │   │   └── admin.service.ts
│       │   │
│       │   ├── store/
│       │   │   ├── useAuthStore.ts
│       │   │   ├── useCartStore.ts
│       │   │   ├── useProductStore.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── styles/
│       │   │   ├── globals.css
│       │   │   └── components/
│       │   │       ├── admin.css
│       │   │       └── dashboard.css
│       │   │
│       │   ├── types/
│       │   │   ├── auth.ts
│       │   │   ├── product.ts
│       │   │   ├── order.ts
│       │   │   ├── cart.ts
│       │   │   ├── user.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── utils/                                  # NEW FOLDER
│       │   │   ├── formatters.ts                       # NEW (formatPrice, formatDate, etc.)
│       │   │   ├── validators.ts
│       │   │   ├── helpers.ts
│       │   │   └── constants.ts
│       │   │
│       │   └── middleware.ts
│       │
│       ├── public/
│       │   ├── images/
│       │   │   ├── products/
│       │   │   └── logos/
│       │   └── uploads/
│       │
│       ├── .env.local
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── shared/
│   ├── dto/
│   │   ├── auth.dto.ts
│   │   ├── user.dto.ts
│   │   └── product.dto.ts
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│   │
│   └── constants/
│       └── roles.constants.ts
│
├── scripts/
│   ├── create-admin.js
│   ├── test-admin-fix.js
│   └── test-otp-flow.js