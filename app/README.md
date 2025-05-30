# commune - Decentralized Hub for AI Modules

commune is a fully open source protocol for developers to create, connect, and share machine learning modules in a decentralized environment.

## Features

- **Module Discovery**: Browse and search through a collection of AI modules
- **Wallet Integration**: Connect with various blockchain wallets (Polkadot, Ethereum, Solana)
- **Code Viewing**: Examine module code directly in the browser
- **API Testing**: Test module APIs through an interactive interface
- **Discussions**: Engage with the community about specific modules

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/commune.git
cd commune

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Architecture

commune is built with:

- **Next.js**: React framework for the frontend
- **Tailwind CSS**: For styling
- **Zustand**: State management
- **Polkadot.js**: For blockchain interactions
- **Framer Motion**: For animations

## Wallet Support

commune supports multiple blockchain wallets:

- Polkadot (Substrate-based chains)
- Ethereum (MetaMask)
- Solana (Phantom)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
