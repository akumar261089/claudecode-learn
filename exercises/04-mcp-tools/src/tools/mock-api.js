#!/usr/bin/env node
/**
 * Mock API MCP Tool
 *
 * Creates and manages mock API endpoints for testing.
 *
 * Usage:
 *   node mock-api.js --action create --endpoint /api/users --method GET --response '{"users":[]}'
 *   node mock-api.js --action list
 *   node mock-api.js --action delete --endpoint /api/users
 *   node mock-api.js --action reset
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const MOCK_DB_FILE = path.join(__dirname, '../../.mock-api-db.json');
const DEFAULT_PORT = 3456;

let server = null;

function loadMocks() {
  try {
    if (fs.existsSync(MOCK_DB_FILE)) {
      return JSON.parse(fs.readFileSync(MOCK_DB_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading mocks:', e.message);
  }
  return { endpoints: {}, serverRunning: false };
}

function saveMocks(mocks) {
  try {
    fs.mkdirSync(path.dirname(MOCK_DB_FILE), { recursive: true });
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(mocks, null, 2));
  } catch (e) {
    console.error('Error saving mocks:', e.message);
  }
}

function createEndpoint(endpoint, method, response) {
  const mocks = loadMocks();
  const key = `${method.toUpperCase()}:${endpoint}`;

  mocks.endpoints[key] = {
    endpoint,
    method: method.toUpperCase(),
    response: typeof response === 'string' ? JSON.parse(response) : response,
    createdAt: new Date().toISOString()
  };

  saveMocks(mocks);

  return {
    success: true,
    message: `Created ${method.toUpperCase()} ${endpoint}`,
    endpoint: mocks.endpoints[key]
  };
}

function listEndpoints() {
  const mocks = loadMocks();
  const endpoints = Object.values(mocks.endpoints);

  return {
    success: true,
    count: endpoints.length,
    endpoints: endpoints,
    serverRunning: mocks.serverRunning,
    baseUrl: `http://localhost:${DEFAULT_PORT}`
  };
}

function deleteEndpoint(endpoint, method) {
  const mocks = loadMocks();
  const key = method ? `${method.toUpperCase()}:${endpoint}` : endpoint;

  if (mocks.endpoints[key]) {
    delete mocks.endpoints[key];
    saveMocks(mocks);
    return {
      success: true,
      message: `Deleted ${key}`
    };
  }

  // Try to match just by endpoint path
  const matchingKeys = Object.keys(mocks.endpoints).filter(k => k.endsWith(':' + endpoint));
  if (matchingKeys.length > 0) {
    matchingKeys.forEach(k => delete mocks.endpoints[k]);
    saveMocks(mocks);
    return {
      success: true,
      message: `Deleted ${matchingKeys.length} endpoint(s) matching ${endpoint}`
    };
  }

  return {
    success: false,
    error: `Endpoint not found: ${endpoint}`
  };
}

function resetMocks() {
  saveMocks({ endpoints: {}, serverRunning: false });
  return {
    success: true,
    message: 'All mock endpoints cleared'
  };
}

function startServer(port = DEFAULT_PORT) {
  if (server) {
    return {
      success: true,
      message: 'Server already running',
      url: `http://localhost:${port}`
    };
  }

  server = http.createServer((req, res) => {
    const mocks = loadMocks();
    const key = `${req.method}:${req.url}`;
    const endpoint = mocks.endpoints[key];

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (endpoint) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(endpoint.response, null, 2));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Not Found',
        message: `No mock configured for ${req.method} ${req.url}`,
        availableEndpoints: Object.keys(mocks.endpoints).map(k => {
          const [method, path] = k.split(':');
          return { method, path };
        })
      }, null, 2));
    }
  });

  server.listen(port, () => {
    const mocks = loadMocks();
    mocks.serverRunning = true;
    saveMocks(mocks);
    console.log(`Mock API server running at http://localhost:${port}`);
  });

  return {
    success: true,
    message: `Server started on port ${port}`,
    url: `http://localhost:${port}`
  };
}

function stopServer() {
  if (server) {
    server.close();
    server = null;

    const mocks = loadMocks();
    mocks.serverRunning = false;
    saveMocks(mocks);

    return {
      success: true,
      message: 'Server stopped'
    };
  }

  return {
    success: false,
    error: 'Server not running'
  };
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const getArg = (flag) => {
    const index = args.indexOf(flag);
    return index !== -1 ? args[index + 1] : null;
  };

  const action = getArg('--action') || args[0];
  const endpoint = getArg('--endpoint');
  const method = getArg('--method') || 'GET';
  const responseStr = getArg('--response');
  const port = parseInt(getArg('--port')) || DEFAULT_PORT;

  if (!action) {
    console.log(JSON.stringify({
      error: "Usage: node mock-api.js --action <create|list|delete|reset|start|stop> [options]",
      success: false
    }, null, 2));
    process.exit(1);
  }

  let result;

  switch (action) {
    case 'create':
      if (!endpoint) {
        result = { error: "--endpoint is required for create", success: false };
      } else {
        const response = responseStr || '{}';
        result = createEndpoint(endpoint, method, response);
      }
      break;

    case 'list':
      result = listEndpoints();
      break;

    case 'delete':
      if (!endpoint) {
        result = { error: "--endpoint is required for delete", success: false };
      } else {
        result = deleteEndpoint(endpoint, method);
      }
      break;

    case 'reset':
      result = resetMocks();
      break;

    case 'start':
      result = startServer(port);
      break;

    case 'stop':
      result = stopServer();
      break;

    default:
      result = { error: `Unknown action: ${action}`, success: false };
  }

  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  createEndpoint,
  listEndpoints,
  deleteEndpoint,
  resetMocks,
  startServer,
  stopServer
};
