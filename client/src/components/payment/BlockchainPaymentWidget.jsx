import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Wallet, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react';
import web3PaymentService from '@/services/web3PaymentService';
import axios from 'axios';

const BlockchainPaymentWidget = ({
  listing,
  quantity,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Initialize Web3 listeners
  useEffect(() => {
    web3PaymentService.onAccountsChanged(handleAccountsChanged);
    web3PaymentService.onChainChanged(handleChainChanged);

    return () => {
      // Cleanup
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setWalletAddress(null);
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId) => {
    setChainId(newChainId);
  };

  // Connect wallet
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await web3PaymentService.connectWallet();
      setIsConnected(true);
      setWalletAddress(result.address);
      setChainId(result.chainId);

      // Get balance
      const balanceStr = await web3PaymentService.getBalance();
      setBalance(parseFloat(balanceStr).toFixed(4));
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const handleDisconnectWallet = () => {
    web3PaymentService.disconnectWallet();
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
    setError(null);
  };

  // Process blockchain payment
  const handleBlockchainPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (!isConnected || !walletAddress) {
        throw new Error('Wallet not connected');
      }

      // For demo: show required seller wallet address
      const sellerWalletDemo = '0x742d35Cc6634C0532925a3b844Bc7e7595f42bE0';

      // Send payment to backend
      const response = await axios.post(
        `${API_BASE_URL}/credits/payment`,
        {
          listingId: listing._id,
          quantity,
          paymentMethod: 'blockchain',
          blockchain: {
            enabled: true,
            buyerWallet: walletAddress,
            sellerWallet: sellerWalletDemo,
            chainId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('Payment processed successfully!');
        setTxHash(response.data.data.blockchain?.transactionHash);
        onPaymentSuccess?.(response.data.data);
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      onPaymentError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format wallet address
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <Card className="mb-6 border-blue-200 dark:border-blue-900">
      <CardHeader className="bg-blue-50 dark:bg-blue-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">Blockchain Payment</CardTitle>
          </div>
          {isConnected && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="mt-6 space-y-4">
        {/* Payment Summary */}
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Amount to Pay:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Quantity:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {quantity} credits
            </span>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-900 dark:bg-green-950 dark:border-green-900">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Wallet Connection */}
        {!isConnected ? (
          <Button
            onClick={handleConnectWallet}
            disabled={isLoading || disabled}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask Wallet
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Connected Wallet:
                  </span>
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                {balance && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      ETH Balance:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {balance} ETH
                    </span>
                  </div>
                )}
                {chainId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Chain ID:
                    </span>
                    <Badge variant="outline">{chainId}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handleBlockchainPayment}
              disabled={isLoading || disabled}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <BadgeCheckIcon className="mr-2 h-4 w-4" />
                  Pay with Blockchain ${totalAmount.toFixed(2)}
                </>
              )}
            </Button>

            {/* Transaction Details */}
            {txHash && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Transaction Hash:
                  </p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 break-all text-sm font-mono"
                  >
                    {formatAddress(txHash)}
                    <LinkIcon className="h-4 w-4 flex-shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {/* Disconnect Button */}
            <Button
              onClick={handleDisconnectWallet}
              variant="outline"
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}

        {/* Advanced Options */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {showAdvanced && (
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              📋 Requirements for blockchain payment:
            </p>
            <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400 list-disc list-inside">
              <li>MetaMask wallet installed and connected</li>
              <li>Balance in connected wallet</li>
              <li>Network set to Sepolia Testnet (for demo)</li>
              <li>USDC tokens for payment</li>
              <li>Gas fees in ETH</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Icon component
const BadgeCheckIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path d="M3.85 8.62a4 4 0 0 0 4.78 6.06l7.99-8.5a.75.75 0 1 1 1.08 1.04l-8 8.56a4 4 0 1 1-5.63-5.66l1.73-1.73m9.06-2.83a4 4 0 0 0-5.66 5.66" />
  </svg>
);

export default BlockchainPaymentWidget;
