# Required Dependencies for Blockchain Payment Integration

## Backend Dependencies (server/package.json)

Add these to your `dependencies` section:

```json
{
  "dependencies": {
    "web3": "^4.3.0",
    "ethers": "^6.8.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomiclabs/hardhat-ethers": "^10.2.0",
    "@nomiclabs/hardhat-waffle": "^4.0.0",
    "ethereum-waffle": "^4.0.10",
    "chai": "^4.3.10",
    "ethers": "^6.8.0"
  }
}
```

### Installation Command:

```bash
cd server
npm install web3@^4.3.0 ethers@^6.8.0 dotenv@^16.3.1
npm install --save-dev hardhat@^2.19.0 @nomiclabs/hardhat-ethers@^10.2.0
```

---

## Frontend Dependencies (client/package.json)

Add these to your `dependencies` section:

```json
{
  "dependencies": {
    "ethers": "^6.8.0",
    "web3": "^4.3.0",
    "axios": "^1.6.0"
  }
}
```

### Installation Command:

```bash
cd client
npm install ethers@^6.8.0 web3@^4.3.0
```

---

## Dependency Explanation

| Package | Version | Purpose |
|---------|---------|---------|
| **web3** | ^4.3.0 | Web3.js library for blockchain interaction |
| **ethers** | ^6.8.0 | Alternative/complementary Ethereum library |
| **dotenv** | ^16.3.1 | Environment variable management (backend) |
| **hardhat** | ^2.19.0 | Ethereum development environment & testing |
| **@nomiclabs/hardhat-ethers** | ^10.2.0 | Hardhat plugin for ethers.js integration |

---

## Version Compatibility

- **Node.js**: >=14.0.0 (recommend 18+)
- **npm**: >=7.0.0
- **Web3.js v4**: Breaking changes from v3, uses promises instead of callbacks
- **ethers v6**: Full ESM support, lightweight alternative

---

## Package.json Update Example

### Before:
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0"
  }
}
```

### After:
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "web3": "^4.3.0",
    "ethers": "^6.8.0",
    "dotenv": "^16.3.1"
  }
}
```

---

## Verification

After installation, verify packages are installed:

```bash
# Backend
cd server
npm ls web3 ethers

# Frontend
cd client
npm ls ethers web3
```

Should show:
```
web3@4.3.0
ethers@6.8.0
```

---

## Troubleshooting Installation

### If "npm ERR! conflicting peer dependencies"

```bash
npm install --legacy-peer-deps
```

### If modules not found after installation

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Check if MetaMask is available in browser

MetaMask injects `window.ethereum` automatically. For testing:

```javascript
if (window.ethereum) {
  console.log('MetaMask found');
} else {
  console.log('MetaMask not installed');
}
```

---

**All dependencies added successfully!**
Ready to proceed with blockchain implementation.
