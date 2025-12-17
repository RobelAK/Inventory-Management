# The Temporal Warehouse - Inventory Management System

A full-stack inventory management application built as a senior full-stack developer technical assessment.

This system provides strict auditability of stock levels over time, allowing users to view the exact stock quantity of a product at any historical point in time.

## Features

- **Product Management**: Full CRUD operations for products (Name, SKU, Price, CurrentQuantity)
- **Unique SKU Enforcement**: SKU must be unique across all products
- **Stock Adjustments**: Dedicated Add Stock and Remove Stock operations (direct quantity editing is prohibited)
- **Negative Stock Prevention**: Cannot remove more stock than available
- **Optimistic Concurrency Control**: Handles race conditions — if two users attempt to remove the last item simultaneously, only one succeeds
- **Full Audit Trail**: Every stock change is logged with timestamp, type (Add/Remove), quantity changed, and new total
- **Historical Stock Query**: View exact stock level of a product at any past date and time
- **Authentication**: JWT-based login system
- **Clean Local Timestamps**: Dates stored and displayed as local time without timezone offsets
- **Professional UI**: Built with React, TypeScript, and Material UI (MUI)
- **User-Friendly Feedback**: React Toastify for success/error notifications

## Tech Stack

### Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- PostgreSQL (with Npgsql provider)
- ASP.NET Core Identity + JWT Authentication
- Optimistic concurrency using GUID token

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Material UI (MUI)
- React Toastify (notifications)
- Axios (HTTP client)

## Database Schema

- **Products**
  - Id (PK)
  - Name
  - SKU (unique)
  - Price
  - CurrentQuantity
  - ConcurrencyGuid (for optimistic concurrency)

- **StockTransactions** (audit log)
  - Id (PK)
  - ProductId (FK)
  - DateTime (timestamp without time zone — local time)
  - Type (Add / Remove)
  - QuantityChanged
  - NewTotal

- ASP.NET Identity tables (AspNetUsers, etc.)

## How to Run

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- PostgreSQL 15+

### Setup

1. **Database**
   - Create a database named `InventoryManagement`
   - Update the connection string in `appsettings.json` if needed

2. **Backend**
   ```bash
   cd InventoryManagement.Api
   dotnet restore
   dotnet ef database update  # Applies migrations
   dotnet run