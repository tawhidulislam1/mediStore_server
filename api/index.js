var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express8 from "express";
import cors from "cors";

// src/middlewere/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Rounte Not Found",
    path: req.originalUrl,
    date: Date()
  });
}

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Medicines {\n  id           String         @id @default(uuid())\n  name         String         @db.VarChar(255)\n  description  String?        @db.Text\n  price        Float\n  stock        Int\n  status       MedicineStatus @default(ACTIVE)\n  manufacturer String\n  expiryDate   DateTime\n  image        String?\n  category     Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  categoryId   Int\n  seller       User           @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n  sellerId     String\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  reviews      Reviews[]\n  cartItems    CartItem[]\n  orderItems   OrderItem[]\n\n  @@index([sellerId])\n  @@map("medicines")\n}\n\nmodel Category {\n  id          Int         @id @default(autoincrement())\n  name        String      @unique\n  description String?\n  userId      String?\n  user        User?       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt   DateTime    @default(now())\n  updatedAt   DateTime    @updatedAt\n  Medicines   Medicines[]\n}\n\nmodel Orders {\n  id              String      @id @default(uuid())\n  customer        User        @relation(fields: [customerId], references: [id])\n  customerId      String\n  totalPrice      Float\n  status          OrderStatus @default(PENDING)\n  paymentGateway  String?\n  shippingAddress String?\n  orderItems      OrderItem[]\n  orderDate       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  @@index([customerId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String    @id @default(uuid())\n  orderId    String\n  order      Orders    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicines  Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  quantity  Int\n  price     Float\n  createdAt DateTime @default(now())\n}\n\nmodel Reviews {\n  id         String       @id @default(uuid())\n  medicineId String\n  medicines  Medicines    @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  customer   User         @relation(fields: [customerId], references: [id])\n  customerId String\n  status     ReviewStatus @default(APPROVED)\n  rating     Int\n  comment    String?      @db.Text\n  createdAt  DateTime     @default(now())\n\n  @@index([medicineId])\n  @@index([customerId])\n  @@map("reviews")\n}\n\nmodel CartItem {\n  id         String    @id @default(uuid())\n  cartId     String\n  cart       Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  customer   User      @relation(fields: [customerId], references: [id])\n  customerId String\n  medicineId String\n  medicines  Medicines @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity   Int\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String\n  items     CartItem[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n}\n\nenum MedicineStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\nenum OrderStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  PROCESSING\n  SHIPPED\n  CANCEL\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role       String?     @default("CUSTOMER")\n  phone      String?\n  status     String?     @default("ACTIVE")\n  medicines  Medicines[]\n  orders     Orders[]\n  cartItems  CartItem[]\n  reviews    Reviews[]\n  categories Category[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Medicines":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"MedicineStatus"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicines"},{"name":"categoryId","kind":"scalar","type":"Int"},{"name":"seller","kind":"object","type":"User","relationName":"MedicinesToUser"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"MedicinesToReviews"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicines"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicinesToOrderItem"}],"dbName":"medicines"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"Medicines","kind":"object","type":"Medicines","relationName":"CategoryToMedicines"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentGateway","kind":"scalar","type":"String"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"},{"name":"orderDate","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Reviews":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToReviews"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewsToUser"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"customer","kind":"object","type":"User","relationName":"CartItemToUser"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"CartItemToMedicines"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicines","relationName":"MedicinesToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToUser"},{"name":"reviews","kind":"object","type":"Reviews","relationName":"ReviewsToUser"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicinesScalarFieldEnum: () => MedicinesScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrdersScalarFieldEnum: () => OrdersScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewsScalarFieldEnum: () => ReviewsScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Medicines: "Medicines",
  Category: "Category",
  Orders: "Orders",
  OrderItem: "OrderItem",
  Reviews: "Reviews",
  CartItem: "CartItem",
  Cart: "Cart",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var MedicinesScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  stock: "stock",
  status: "status",
  manufacturer: "manufacturer",
  expiryDate: "expiryDate",
  image: "image",
  categoryId: "categoryId",
  sellerId: "sellerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrdersScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  totalPrice: "totalPrice",
  status: "status",
  paymentGateway: "paymentGateway",
  shippingAddress: "shippingAddress",
  orderDate: "orderDate",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  price: "price",
  createdAt: "createdAt"
};
var ReviewsScalarFieldEnum = {
  id: "id",
  medicineId: "medicineId",
  customerId: "customerId",
  status: "status",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  customerId: "customerId",
  medicineId: "medicineId",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  CANCEL: "CANCEL"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000"
    ].filter(Boolean);
    if (!origin || allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return [origin];
    }
    return [];
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.role = user.role;
      return session;
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});

// src/modules/Category/category.route.ts
import express from "express";

// src/modules/Category/category.service.ts
var createCategory = async (data, userId) => {
  const res = await prisma.category.create({
    data: {
      ...data,
      userId
    }
  });
  return res;
};
var getAllCategory = async () => {
  const res = await prisma.category.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true
        }
      },
      _count: {
        select: {
          Medicines: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return res;
};
var getCategoryById = async (id) => {
  const res = await prisma.category.findMany({
    where: {
      id
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true
        }
      },
      _count: {
        select: {
          Medicines: true
        }
      }
    }
  });
  return res;
};
var updateCategory = async (categoryId, data, userId, isAdmin) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId
    },
    include: {
      user: true
    }
  });
  if (!isAdmin && categoryData.userId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.category.update({
    where: {
      id: categoryData.id
    },
    data
  });
  return result;
};
var deleteCategory = async (categoryId) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId
    }
  });
  return await prisma.category.delete({
    where: {
      id: categoryData.id
    }
  });
};
var categoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/middlewere/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Your are not authorlized"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "forbiden"
        });
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};
var auth_default = auth2;

// src/modules/Category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to create a category"
      });
    }
    const result = await categoryService.createCategory(
      req.body,
      user.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Category Created failed",
      details: error
    });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategory();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Category Find failed",
      details: error
    });
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const id = Number(categoryId);
    const result = await categoryService.getCategoryById(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid category id",
      details: error
    });
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { categoryId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const id = Number(categoryId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id"
      });
    }
    const isAdmin = user?.role === "ADMIN" /* ADMIN */;
    const result = await categoryService.updateCategory(
      id,
      req.body,
      user?.id,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const user = req.user;
    const { categoryId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const id = Number(categoryId);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id"
      });
    }
    const result = await categoryService.deleteCategory(id);
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "post delete failed",
      details: error
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategory: getAllCategory2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/Category/category.route.ts
var router = express.Router();
router.post("/", auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.get(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  categoryController.getCategoryById
);
router.patch(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
router.delete(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var CategoryRouter = router;

// src/modules/medicine/medicine.route.ts
import express2 from "express";

// src/modules/medicine/medicine.service.ts
var createMedicine = async (data) => {
  const medicineData = {
    ...data
  };
  const res = await prisma.medicines.create({
    data: medicineData
  });
  return res;
};
var getAllMedicine = async (payload) => {
  const addCondition = [];
  if (payload.search) {
    addCondition.push({
      OR: [
        {
          name: {
            contains: payload.search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: payload.search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (payload.category) {
    addCondition.push({
      categoryId: Number(payload.category)
    });
  }
  if (payload.status) {
    addCondition.push({
      status: payload.status
    });
  }
  const res = await prisma.medicines.findMany({
    where: {
      AND: addCondition
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      category: {
        select: { name: true }
      },
      reviews: true,
      seller: {
        select: {
          name: true,
          email: true,
          id: true
        }
      },
      _count: {
        select: { orderItems: true, reviews: true }
      }
    }
  });
  return res;
};
var getMedicineById = async (medicineid) => {
  const res = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineid
    },
    include: {
      category: {
        select: { name: true, id: true }
      },
      reviews: {
        select: {
          comment: true,
          createdAt: true,
          id: true,
          customer: {
            select: {
              name: true,
              id: true
            }
          }
        }
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          role: true
        }
      },
      _count: {
        select: { reviews: true, orderItems: true }
      }
    }
  });
  return res;
};
var getMedicineBySeller = async (sellerId) => {
  const medicineData = await prisma.medicines.findMany({
    where: {
      sellerId
    },
    include: {
      category: {
        select: { name: true }
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          role: true
        }
      }
    }
  });
  return medicineData;
};
var updateMedicine = async (medicineId, data, userId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    include: {
      seller: true
    }
  });
  if (medicineData.sellerId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.medicines.update({
    where: {
      id: medicineData.id
    },
    data
  });
  return result;
};
var deleteMedicine = async (medicineId) => {
  const medicineData = await prisma.medicines.findUniqueOrThrow({
    where: {
      id: medicineId
    }
  });
  return await prisma.medicines.delete({
    where: {
      id: medicineData.id
    }
  });
};
var medicineService = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
  getMedicineBySeller,
  updateMedicine,
  deleteMedicine
};

// src/modules/medicine/medicineController.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (user?.role !== "ADMIN" /* ADMIN */ && user?.role !== "SELLER" /* SELLER */) {
      return res.status(403).json({
        success: false,
        details: "You are not authorized to create medicine"
      });
    }
    const result = await medicineService.createMedicine(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Created failed",
      details: error
    });
  }
};
var getAllMedicine2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const category = req.query.category;
    const status = req.query.status;
    const result = await medicineService.getAllMedicine({
      search: searchString,
      category,
      status
    });
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const { medicineid } = req.params;
    if (!medicineid) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required"
      });
    }
    const result = await medicineService.getMedicineById(medicineid);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error
    });
  }
};
var getMedicineBySeller2 = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const user = req.user;
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required"
      });
    }
    if (user?.id !== sellerId && user?.role !== "ADMIN" /* ADMIN */) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource"
      });
    }
    const result = await medicineService.getMedicineBySeller(
      sellerId
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Medicine Find failed",
      details: error
    });
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;
    const result = await medicineService.updateMedicine(
      medicineId,
      req.body,
      user?.id
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const user = req.user;
    const result = await medicineService.deleteMedicine(medicineId);
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "post delete failed",
      details: error
    });
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicine: getAllMedicine2,
  getMedicineById: getMedicineById2,
  getMedicineBySeller: getMedicineBySeller2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2
};

// src/modules/medicine/medicine.route.ts
var router2 = express2.Router();
router2.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.createMedicine
);
router2.get("/", medicineController.getAllMedicine);
router2.get("/:medicineid", medicineController.getMedicineById);
router2.patch(
  "/:medicineId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.updateMedicine
);
router2.get(
  "/seller/:sellerId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.getMedicineBySeller
);
router2.delete(
  "/:medicineId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  medicineController.deleteMedicine
);
var MedicinesRouter = router2;

// src/modules/reviews/review.route.ts
import express3 from "express";

// src/modules/reviews/review.service.ts
var createReview = async (payload) => {
  return await prisma.reviews.create({
    data: payload
  });
};
var reviewAll = async () => {
  return await prisma.reviews.findMany({
    include: {
      medicines: {
        select: {
          name: true,
          id: true
        }
      },
      customer: {
        select: {
          name: true,
          id: true
        }
      }
    }
  });
};
var reviewById = async (id) => {
  return await prisma.reviews.findUnique({
    where: {
      id
    },
    include: {
      medicines: {
        select: {
          name: true,
          id: true
        }
      },
      customer: {
        select: {
          name: true,
          id: true
        }
      }
    }
  });
};
var reviewUpdate = async (reviewId, data, userId) => {
  const reviewData = await prisma.reviews.findUniqueOrThrow({
    where: {
      id: reviewId
    },
    include: {
      customer: true
    }
  });
  if (reviewData.customerId !== userId) {
    throw new Error("your are not owner in this review");
  }
  const result = await prisma.reviews.update({
    where: {
      id: reviewData.id
    },
    data
  });
  return result;
};
var reviewDelete = async (reviewId, userId, isAdmin) => {
  const reviewData = await prisma.reviews.findUnique({
    where: {
      id: reviewId
    },
    include: {
      customer: true
    }
  });
  if (!reviewData) {
    throw new Error("Review not found");
  }
  if (!isAdmin && reviewData.customerId !== userId) {
    throw new Error("your are not owner in this post");
  }
  const result = await prisma.reviews.delete({
    where: {
      id: reviewId
    }
  });
  return result;
};
var reviewService = {
  createReview,
  reviewAll,
  reviewById,
  reviewUpdate,
  reviewDelete
};

// src/modules/reviews/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const result = await reviewService.createReview(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review created failed",
      details: error
    });
  }
};
var reviewAll2 = async (req, res) => {
  try {
    const result = await reviewService.reviewAll();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review Finds failed",
      details: error
    });
  }
};
var reviewById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reviewService.reviewById(id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "review Find failed",
      details: error
    });
  }
};
var reviewUpdate2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await reviewService.reviewUpdate(
      id,
      req.body,
      user?.id
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var reviewDelete2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const isAdmin = user?.role === "ADMIN" /* ADMIN */;
    const result = await reviewService.reviewDelete(
      id,
      user?.id,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  reviewAll: reviewAll2,
  reviewById: reviewById2,
  reviewUpdate: reviewUpdate2,
  reviewDelete: reviewDelete2
};

// src/modules/reviews/review.route.ts
var router3 = express3.Router();
router3.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  reviewController.createReview
);
router3.get("/", reviewController.reviewAll);
router3.get("/:id", reviewController.reviewById);
router3.patch(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  reviewController.reviewUpdate
);
router3.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  reviewController.reviewDelete
);
var ReviewRouter = router3;

// src/modules/cart/cart.route.ts
import express4 from "express";

// src/modules/cart/cart.service.ts
var createCart = async (data, userId) => {
  const cartData = await prisma.cart.findFirst({
    where: { userId }
  });
  if (!cartData) {
    return prisma.cart.create({
      data: {
        ...data
      }
    });
  }
  return cartData;
};
var getMyCart = async (userId) => {
  let cart = await prisma.cart.findMany({
    where: { userId },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          medicines: {
            select: {
              name: true,
              price: true,
              id: true,
              image: true,
              description: true
            }
          }
        }
      }
    }
  });
  return cart;
};
var getCartById = async (id) => {
  const cart = await prisma.cart.findFirst({
    where: { id },
    include: {
      items: true
    }
  });
  return cart;
};
var deleteCartById = async (id, userId) => {
  const cartData = await prisma.cart.findFirst({
    where: { userId }
  });
  if (cartData?.userId !== userId) {
    throw new Error("You are not authorized to delete this cart");
  }
  return await prisma.cart.delete({
    where: { id }
  });
};
var CartService = {
  createCart,
  getCartById,
  getMyCart,
  deleteCartById
};

// src/modules/cart/cart.controller.ts
var createCart2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await CartService.createCart(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart created failed",
      details: error
    });
  }
};
var getMyCart2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await CartService.getMyCart(user?.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var getCartById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CartService.getCartById(id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var deleteCartById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CartService.deleteCartById(
      id,
      user?.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var cartController = {
  createCart: createCart2,
  getCartById: getCartById2,
  getMyCart: getMyCart2,
  deleteCartById: deleteCartById2
};

// src/modules/cart/cart.route.ts
var router4 = express4.Router();
router4.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.createCart
);
router4.get(
  "/myCart",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.getMyCart
);
router4.get(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.getCartById
);
router4.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartController.deleteCartById
);
var CartRouter = router4;

// src/modules/cartItem/cartItem.route.ts
import express5 from "express";

// src/modules/cartItem/cartItem.service.ts
var createCartItem = async (payload) => {
  let cart = null;
  if (payload.cartId) {
    cart = await prisma.cart.findUnique({
      where: { id: payload.cartId },
      include: { items: true }
    });
  } else {
    cart = await prisma.cart.findFirst({
      where: { userId: payload.customerId },
      include: { items: true }
    });
  }
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: payload.customerId },
      include: { items: true }
    });
  }
  const existingItem = cart.items.find(
    (item) => item.medicineId === payload.medicineId
  );
  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: {
          increment: payload.quantity
        }
      }
    });
    return updatedItem;
  }
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      customerId: payload.customerId,
      medicineId: payload.medicineId,
      quantity: payload.quantity
    }
  });
  return cartItem;
};
var getCartItem = async () => {
  const cart = await prisma.cartItem.findMany({
    include: {
      medicines: {
        select: {
          id: true,
          name: true,
          description: true,
          stock: true,
          price: true,
          sellerId: true,
          categoryId: true,
          image: true
        }
      }
    }
  });
  const cartWithTotal = cart.map((item) => {
    const totalPrice = item.quantity * item.medicines.price;
    return {
      ...item,
      totalPrice
    };
  });
  return cartWithTotal;
};
var updateCartItem = async (cartItemId, quantity) => {
  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: quantity,
    include: { medicines: true }
  });
  return updatedCartItem;
};
var deleteCartItemById = async (id, userId) => {
  const cartData = await prisma.cartItem.findFirst({
    where: { customerId: userId }
  });
  if (cartData?.customerId !== userId) {
    throw new Error("You are not authorized to delete this cart");
  }
  return await prisma.cartItem.delete({
    where: { id }
  });
};
var CartItemService = {
  createCartItem,
  getCartItem,
  updateCartItem,
  deleteCartItemById
};

// src/modules/cartItem/cartItem.controller.ts
var createCartItem2 = async (req, res) => {
  try {
    const result = await CartItemService.createCartItem(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart created failed",
      details: error
    });
  }
};
var getCartItem2 = async (req, res) => {
  try {
    const result = await CartItemService.getCartItem();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var updateCartItem2 = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const result = await CartItemService.updateCartItem(
      cartItemId,
      req.body
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart update failed",
      details: error
    });
  }
};
var deleteCartItemById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CartItemService.deleteCartItemById(
      id,
      user?.id
    );
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "cart find failed",
      details: error
    });
  }
};
var cartItemController = {
  createCartItem: createCartItem2,
  getCartItem: getCartItem2,
  updateCartItem: updateCartItem2,
  deleteCartItemById: deleteCartItemById2
};

// src/modules/cartItem/cartItem.route.ts
var router5 = express5.Router();
router5.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.createCartItem
);
router5.get(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.getCartItem
);
router5.patch(
  "/:cartItemId",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.updateCartItem
);
router5.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  cartItemController.deleteCartItemById
);
var CartItemRouter = router5;

// src/modules/order/order.route.ts
import express6 from "express";

// src/modules/order/order.service.ts
var createOrder = async (data, userId) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId: userId },
      include: { medicines: true }
    });
    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.medicines.price,
      0
    );
    for (const item of cartItems) {
      await prisma.medicines.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
    const order = await prisma.orders.create({
      data: {
        customerId: userId,
        totalPrice,
        shippingAddress: data.shippingAddress,
        paymentGateway: data.paymentGateway,
        orderItems: {
          create: cartItems.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.medicines.price
          }))
        }
      },
      include: {
        orderItems: true
      }
    });
    await prisma.cartItem.deleteMany({ where: { customerId: userId } });
    return order;
  } catch (err) {
    console.error("Checkout failed:", err);
    throw new Error("Could not complete order");
  }
};
var getAllOrders = async (user) => {
  let whereCondition = {};
  if (user.role === "ADMIN" /* ADMIN */) {
    whereCondition = {};
  } else if (user.role === "CUSTOMER" /* CUSTOMER */) {
    whereCondition = { customerId: user.id };
  } else if (user.role === "SELLER" /* SELLER */) {
    whereCondition = {
      orderItems: {
        some: {
          medicines: {
            sellerId: user.id
          }
        }
      }
    };
  }
  const orders = await prisma.orders.findMany({
    where: whereCondition,
    include: {
      customer: {
        select: {
          name: true,
          image: true,
          email: true,
          role: true,
          phone: true
        }
      },
      orderItems: {
        where: user.role === "SELLER" /* SELLER */ ? { medicines: { sellerId: user.id } } : {},
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              price: true,
              manufacturer: true,
              seller: {
                select: { name: true, categories: { select: { name: true } } }
              }
            }
          }
        }
      }
    },
    orderBy: { orderDate: "desc" }
  });
  return orders;
};
var getOrderById = async (orderId, user) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          image: true,
          role: true,
          phone: true
        }
      },
      orderItems: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              price: true,
              manufacturer: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  categories: {
                    select: { name: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  if (!order) throw new Error("Order not found");
  if (user.role === "SELLER" /* SELLER */) {
    const sellerItems = order.orderItems.filter(
      (item) => item.medicines.seller.id === user.id
    );
    if (sellerItems.length === 0)
      throw new Error("Not authorized to view this order");
    const sellerSubtotal = sellerItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    return {
      orderId: order.id,
      status: order.status,
      orderDate: order.orderDate,
      totalPrice: order.totalPrice,
      customer: order.customer,
      items: sellerItems,
      sellerSubtotal
    };
  }
  if (user.role === "CUSTOMER" /* CUSTOMER */ && order.customerId !== user.id) {
    throw new Error("You are not authorized to view this order");
  }
  return order;
};
var updateOrderStatus = async (orderId, userId, userRoles, newStatus) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (userRoles.includes("CUSTOMER" /* CUSTOMER */)) {
    if (newStatus !== OrderStatus.CANCEL) {
      throw new Error("Customers can only cancel orders");
    }
    if (order.customerId !== userId) {
      throw new Error("You cannot update this order");
    }
    return prisma.orders.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCEL,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  if (userRoles.includes("SELLER" /* SELLER */)) {
    const sellerItems = await prisma.orderItem.findMany({
      where: {
        orderId,
        medicines: {
          sellerId: userId
        }
      }
    });
    if (sellerItems.length === 0) {
      throw new Error("You are not authorized to update this order");
    }
    return prisma.orders.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  throw new Error("You are not authorized to update orders");
};
var orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req.user;
    const result = await orderService.createOrder(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order created failed",
      details: error
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id || !user.role) {
      return res.status(401).json({
        error: "Unauthorized: user information missing"
      });
    }
    const result = await orderService.getAllOrders({
      id: user.id,
      role: user.role
    });
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order find failed",
      details: error
    });
  }
};
var getOrdersById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const result = await orderService.getOrderById(orderId, user);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order find failed",
      details: error
    });
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const newStatus = req.body.status;
    if (!user) {
      return res.status(401).json({
        success: false,
        details: "Unauthorized"
      });
    }
    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      user.id,
      user.role,
      newStatus
    );
    res.status(200).json({
      success: true,
      result: updatedOrder
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      details: error.message || "Something went wrong"
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  getOrdersById,
  updateOrderStatus: updateOrderStatus2
};

// src/modules/order/order.route.ts
var router6 = express6.Router();
router6.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.createOrder
);
router6.get(
  "/",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.getAllOrders
);
router6.get(
  "/:orderId",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  orderController.getOrdersById
);
router6.patch(
  "/:orderId",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */),
  orderController.updateOrderStatus
);
var orderRouter = router6;

// src/middlewere/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "internal  server error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "your provide incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found. {cause}";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field: {field_name}";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "This is a non-recoverable error which probably happened inside the Prisma Query Engine";
  }
  if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "authocation filed.plase check your info";
    }
    if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "can't reach database server ";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: err
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/user/user.route.ts
import express7 from "express";

// src/modules/user/user.service.ts
var getAlluser = async () => {
  const res = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true, medicines: true, reviews: true }
      }
    }
  });
  return res;
};
var getAlluserById = async (userId) => {
  const res = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cartItems: true,
      _count: {
        select: { orders: true, medicines: true, reviews: true }
      }
    }
  });
  return res;
};
var updateUserData = async (userId, data) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const result = await prisma.user.update({
    where: {
      id: userData.id
    },
    data
  });
  return result;
};
var updateUser = async (userId, data, isAdmin) => {
  const postData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    select: {
      id: true
    }
  });
  if (!isAdmin && postData.id !== userId) {
    throw new Error("your are not owner in this user");
  }
  if (!isAdmin) {
    delete data.role;
  }
  const result = await prisma.user.update({
    where: {
      id: postData.id
    },
    data
  });
  return result;
};
var deleteUser = async (userId) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  return await prisma.user.delete({
    where: {
      id: userData.id
    }
  });
};
var userService = {
  getAlluser,
  getAlluserById,
  updateUserData,
  updateUser,
  deleteUser
};

// src/modules/user/uesr.controller.ts
var getAllUser = async (req, res) => {
  try {
    const result = await userService.getAlluser();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "User Find failed",
      details: error
    });
  }
};
var getAlluserById2 = async (req, res) => {
  try {
    const authUser = req.user;
    const { userId } = req.params;
    let result;
    if (userId) {
      if (authUser?.role !== "ADMIN" /* ADMIN */) {
        return res.status(403).json({
          success: false,
          error: "Only admin can view other users' info"
        });
      }
      result = await userService.getAlluserById(userId);
    } else {
      result = await userService.getAlluserById(authUser?.id);
    }
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "User Find failed",
      details: error
    });
  }
};
var updateUserData2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await userService.updateUserData(
      user?.id,
      req.body
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var updateUser2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const isAdmin = user?.role === "ADMIN" /* ADMIN */;
    const result = await userService.updateUser(
      userId,
      req.body,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
      throw new Error("your are not user go to login");
    }
    const result = await userService.deleteUser(userId);
    res.status(201).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "user stats get failed",
      details: error
    });
  }
};
var userController = {
  getAllUser,
  getAlluserById: getAlluserById2,
  updateUserData: updateUserData2,
  updateUser: updateUser2,
  deleteUser: deleteUser2
};

// src/modules/user/user.route.ts
var router7 = express7.Router();
router7.get("/", auth_default("ADMIN" /* ADMIN */), userController.getAllUser);
router7.get(
  "/me",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  userController.getAlluserById
);
router7.patch(
  "/updateProfile",
  auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  userController.updateUserData
);
router7.get("/:userId", auth_default("ADMIN" /* ADMIN */), userController.getAlluserById);
router7.patch("/:userId", auth_default("ADMIN" /* ADMIN */), userController.updateUser);
router7.delete("/:userId", auth_default("ADMIN" /* ADMIN */), userController.deleteUser);
var UserRouter = router7;

// src/app.ts
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL,
  // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000"
].filter(Boolean);
var app = express8();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express8.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/user", UserRouter);
app.use("/admin/category", CategoryRouter);
app.use("/medicine", MedicinesRouter);
app.use("/review", ReviewRouter);
app.use("/cart", CartRouter);
app.use("/cartItem", CartItemRouter);
app.use("/api/orders", orderRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
