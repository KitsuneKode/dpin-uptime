# DPIN Uptime Monitoring - MVP Setup Guide

## 🎯 Overview

This uptime monitoring system is built with a distributed architecture similar to BetterUptime. It consists of:

- **Web Dashboard** (Next.js) - User interface for managing monitors
- **API Server** (Express.js) - Backend REST API
- **Hub Server** (Bun WebSocket) - Coordinates validators and collects monitoring data
- **Validator Workers** (Bun) - Distributed workers that ping websites

## 📋 What's Been Implemented

### ✅ Backend Infrastructure
- [x] Database schema with Prisma (PostgreSQL)
  - Users, Monitors, Validators, WebsiteTicks, Incidents
- [x] Authentication (Better Auth with email/password + OAuth)
- [x] Monitor CRUD API endpoints
- [x] Dashboard metrics aggregation API
- [x] Incident management API
- [x] WebSocket hub for validator coordination

### ✅ Core Monitoring System
- [x] Ping scheduler (runs every 30 seconds)
- [x] Validator registration with Solana signature verification
- [x] Website health checking with latency measurement
- [x] Automatic incident detection (3 consecutive failures)
- [x] Automatic incident resolution when service recovers

### ✅ Frontend
- [x] Dashboard with real-time metrics
- [x] Monitor management (create, list, delete)
- [x] Metrics cards (total monitors, uptime %, incidents, avg response time)
- [x] Monitor status table
- [x] Response time charts
- [x] Recent incidents display

## 🚀 Quick Start

### Prerequisites

- **Bun** (v1.0+) - [Install Bun](https://bun.sh)
- **PostgreSQL** (v14+) - Running instance
- **Node.js** (v20+) - For compatibility

### 1. Environment Setup

Create `.env` files for each service:

#### `packages/store/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dpin-uptime"
```

#### `apps/api/.env`
```env
PORT=8080
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/dpin-uptime"
NODE_ENV=development
BETTER_AUTH_SECRET="your-random-secret-key-here"
BETTER_AUTH_URL=http://localhost:8080
```

#### `apps/hub/.env`
```env
PORT=8081
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/dpin-uptime"
NODE_ENV=development
```

#### `apps/web/.env`
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK_API=false
DATABASE_URL="postgresql://user:password@localhost:5432/dpin-uptime"
NODE_ENV=development
```

#### `apps/validator/.env`
```env
HUB_URL=ws://localhost:8081
VALIDATOR_IP=localhost
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Database Setup

```bash
# Run migrations
cd packages/store
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate
```

### 4. Start All Services

Open **4 separate terminals** and run:

**Terminal 1 - API Server:**
```bash
cd apps/api
bun run dev
```

**Terminal 2 - Hub Server:**
```bash
cd apps/hub
bun run dev
```

**Terminal 3 - Validator Worker:**
```bash
cd apps/validator
bun run dev
```

**Terminal 4 - Web Dashboard:**
```bash
cd apps/web
bun run dev
```

### 5. Access the Application

- **Web Dashboard:** http://localhost:3000
- **API Server:** http://localhost:8080
- **Hub Server:** ws://localhost:8081

## 📝 How It Works

### Data Flow

```
1. User adds a monitor via Web UI
   → API saves monitor to database

2. Ping Scheduler (Hub) runs every 30 seconds
   → Fetches all active monitors
   → Sends "validate" message to available validators via WebSocket

3. Validator receives ping request
   → Performs HTTP HEAD request to monitor URL
   → Measures latency
   → Signs result with Solana keypair
   → Sends result back to Hub

4. Hub receives validation result
   → Verifies signature
   → Saves WebsiteTick to database
   → Checks for incident conditions (3 consecutive failures)
   → Auto-creates or auto-resolves incidents

5. Dashboard displays real-time data
   → Fetches metrics from API every 60 seconds
   → Shows uptime %, response times, incidents
```

### Incident Detection Logic

- **Open Incident:** Triggered after 3 consecutive "Bad" ticks
- **Auto-Resolve:** When service returns "Good" status
- **Severity:** Always CRITICAL for MVP
- **Status Flow:** OPEN → ACKNOWLEDGED → RESOLVED

## 🧪 Testing the System

### 1. Create Your First Monitor

```bash
# Via API
curl -X POST http://localhost:8080/api/v1/monitor \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

Or use the Web UI at http://localhost:3000/dashboard/monitors

### 2. Watch the Ping Cycle

Check the Hub logs - you should see:
```
Pinging 1 monitor(s) with 1 validator(s)
→ Sent ping request to validator xxx for https://google.com
```

Check the Validator logs - you should see:
```
→ Pinging https://google.com...
✓ Result: Good (45ms)
← Sent validation result for https://google.com
```

Check the Hub logs again:
```
✓ Saved tick for website xxx: Good (45ms)
```

### 3. View Dashboard Metrics

Navigate to http://localhost:3000/dashboard and you'll see:
- Total monitors count
- Overall uptime percentage
- Open incidents count
- Average response time
- Monitor status table with real-time updates

### 4. Simulate a Failure

Create a monitor with a bad URL:
```bash
curl -X POST http://localhost:8080/api/v1/monitor \
  -H "Content-Type: application/json" \
  -d '{"url": "https://definitely-does-not-exist-12345.com"}'
```

After ~90 seconds (3 ping cycles), check the Hub logs:
```
🚨 Created incident xxx for monitor yyy
```

## 📊 API Endpoints

### Monitors
- `POST /api/v1/monitor` - Create monitor
- `GET /api/v1/monitor` - List all monitors
- `GET /api/v1/monitor?id=xxx` - Get single monitor
- `DELETE /api/v1/monitor` - Delete monitor (soft delete)

### Dashboard
- `GET /api/v1/dashboard/metrics` - Overview metrics
- `GET /api/v1/dashboard/response-times?period=24h&monitorIds=xxx,yyy` - Response time data
- `GET /api/v1/dashboard/uptime-stats` - Uptime statistics

### Incidents
- `GET /api/v1/incidents` - List incidents
- `GET /api/v1/incidents/:id` - Get incident details
- `PATCH /api/v1/incidents/:id/acknowledge` - Acknowledge incident
- `PATCH /api/v1/incidents/:id/resolve` - Manually resolve incident

## 🔧 Configuration

### Ping Interval

Edit `apps/hub/src/index.ts`:
```typescript
const pingScheduler = new PingScheduler(availableValidators, 30000) // milliseconds
```

### Incident Threshold

Edit `apps/hub/src/handler/validate.ts`:
```typescript
// Check if the last 3 ticks are all "Bad"
const lastThree = recentTicks.slice(0, 3)
```

### Timeout for Website Pings

Edit `apps/validator/src/index.ts`:
```typescript
signal: AbortSignal.timeout(10000), // 10 second timeout
```

## 🐛 Troubleshooting

### Validator Not Connecting

- Check Hub is running on correct port (default: 8081)
- Verify `HUB_URL` in validator `.env`
- Check Hub logs for connection attempts

### No Ticks Being Saved

- Ensure database connection is working
- Check Prisma migrations are up to date
- Verify validator is successfully signing messages

### Dashboard Shows No Data

- Check API server is running
- Verify `NEXT_PUBLIC_API_URL` in web `.env`
- Check browser console for API errors
- Ensure `NEXT_PUBLIC_USE_MOCK_API=false`

### Authentication Issues

- Verify `BETTER_AUTH_SECRET` is set
- Check `FRONTEND_URL` matches your web app URL
- Clear browser cookies and try again

## 🚀 Next Steps

### Features to Implement
- [ ] Email notifications for incidents
- [ ] Webhook integrations
- [ ] Public status pages
- [ ] Alert escalation rules
- [ ] Multiple validator locations
- [ ] API token authentication
- [ ] Monitor detail page with history
- [ ] Custom check intervals per monitor
- [ ] HTTP method selection (GET, POST, etc.)
- [ ] Response body validation
- [ ] SSL certificate monitoring

### Production Considerations
- [ ] Docker Compose setup
- [ ] Kubernetes deployment
- [ ] Load balancing for validators
- [ ] Redis for caching
- [ ] Rate limiting
- [ ] Monitoring/observability (Prometheus, Grafana)
- [ ] Error tracking (Sentry)
- [ ] Database backups
- [ ] CDN for static assets

## 📚 Architecture Decisions

### Why Bun for Hub and Validator?
- Native WebSocket support
- Excellent performance for I/O operations
- Fast startup time for validators
- Built-in TypeScript support

### Why Solana Keypairs for Validators?
- Cryptographic proof of validator identity
- Prevents spoofing of validation results
- Foundation for future token-based incentives

### Why WebSocket for Validator Communication?
- Persistent connections for low-latency commands
- Push-based architecture (hub → validator)
- Easier scaling than polling

### Why Separate Hub and API?
- API handles user requests (CRUD operations)
- Hub handles real-time monitoring coordination
- Clear separation of concerns
- Different scaling requirements

## 🤝 Contributing

This is an MVP. Key areas for contribution:
- Performance optimization
- Additional monitoring types (TCP, DNS, etc.)
- Better error handling
- Test coverage
- Documentation improvements

## 📄 License

[Your License Here]

---

**Built with:** Next.js 15, Express.js, Bun, Prisma, PostgreSQL, Better Auth, Solana Web3.js
