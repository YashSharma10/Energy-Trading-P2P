// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CarbonCreditPayment
 * @dev Smart contract for handling carbon credit payments and transfers
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract CarbonCreditPayment {
    // State variables
    address public owner;
    IERC20 public usdc; // USDC token for payments
    uint256 public platformFeePercentage = 2; // 2% platform fee
    uint256 public totalTransactions = 0;
    
    // Mapping to store transaction details
    mapping(bytes32 => Transaction) public transactions;
    mapping(address => uint256) public userBalance;
    mapping(address => bool) public whitelistedSellers;
    
    // Transaction structure
    struct Transaction {
        bytes32 transactionId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 quantity;
        string listingId; // MongoDB listing ID
        uint256 timestamp;
        bool completed;
        bool refunded;
    }
    
    // Events
    event PaymentProcessed(
        bytes32 indexed transactionId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 quantity,
        string listingId
    );
    
    event PaymentRefunded(
        bytes32 indexed transactionId,
        address indexed buyer,
        uint256 amount
    );
    
    event PlatformFeeWithdrawn(
        address indexed owner,
        uint256 amount
    );
    
    event SellerWhitelisted(address indexed seller);
    event SellerRemovedFromWhitelist(address indexed seller);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validTransaction(bytes32 txId) {
        require(transactions[txId].buyer != address(0), "Transaction does not exist");
        _;
    }
    
    // Constructor
    constructor(address _usdcAddress) {
        owner = msg.sender;
        usdc = IERC20(_usdcAddress);
    }
    
    /**
     * @dev Process payment for carbon credits
     * @param _buyer Address of the buyer
     * @param _seller Address of the seller
     * @param _amount Total amount to be paid (in USDC)
     * @param _quantity Number of credits bought
     * @param _listingId MongoDB listing ID
     */
    function processPayment(
        address _buyer,
        address _seller,
        uint256 _amount,
        uint256 _quantity,
        string memory _listingId
    ) external returns (bytes32) {
        require(_buyer != address(0), "Invalid buyer address");
        require(_seller != address(0), "Invalid seller address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(whitelistedSellers[_seller], "Seller is not whitelisted");
        
        // Calculate fees
        uint256 platformFee = (_amount * platformFeePercentage) / 100;
        uint256 sellerAmount = _amount - platformFee;
        
        // Transfer funds from buyer to contract
        require(
            usdc.transferFrom(_buyer, address(this), _amount),
            "Payment transfer failed"
        );
        
        // Transfer seller's share
        require(
            usdc.transfer(_seller, sellerAmount),
            "Seller payment transfer failed"
        );
        
        // Create transaction record
        bytes32 transactionId = keccak256(
            abi.encodePacked(_buyer, _seller, _amount, block.timestamp)
        );
        
        transactions[transactionId] = Transaction({
            transactionId: transactionId,
            buyer: _buyer,
            seller: _seller,
            amount: _amount,
            quantity: _quantity,
            listingId: _listingId,
            timestamp: block.timestamp,
            completed: true,
            refunded: false
        });
        
        userBalance[owner] += platformFee; // Owner gets platform fee
        totalTransactions++;
        
        emit PaymentProcessed(
            transactionId,
            _buyer,
            _seller,
            _amount,
            _quantity,
            _listingId
        );
        
        return transactionId;
    }
    
    /**
     * @dev Refund a payment
     * @param _transactionId The transaction ID to refund
     */
    function refundPayment(bytes32 _transactionId)
        external
        onlyOwner
        validTransaction(_transactionId)
    {
        Transaction storage txn = transactions[_transactionId];
        require(!txn.refunded, "Transaction already refunded");
        require(txn.completed, "Transaction is not completed");
        
        // Transfer refund back to buyer
        require(
            usdc.transfer(txn.buyer, txn.amount),
            "Refund transfer failed"
        );
        
        txn.refunded = true;
        
        emit PaymentRefunded(_transactionId, txn.buyer, txn.amount);
    }
    
    /**
     * @dev Get transaction details
     * @param _transactionId The transaction ID
     */
    function getTransaction(bytes32 _transactionId)
        external
        view
        validTransaction(_transactionId)
        returns (Transaction memory)
    {
        return transactions[_transactionId];
    }
    
    /**
     * @dev Verify a transaction exists and is completed
     * @param _transactionId The transaction ID
     */
    function verifyTransaction(bytes32 _transactionId)
        external
        view
        returns (bool)
    {
        return transactions[_transactionId].completed &&
               !transactions[_transactionId].refunded;
    }
    
    /**
     * @dev Whitelist a seller
     * @param _seller Address of the seller
     */
    function whitelistSeller(address _seller) external onlyOwner {
        require(_seller != address(0), "Invalid seller address");
        whitelistedSellers[_seller] = true;
        emit SellerWhitelisted(_seller);
    }
    
    /**
     * @dev Remove seller from whitelist
     * @param _seller Address of the seller
     */
    function removeSellerFromWhitelist(address _seller) external onlyOwner {
        whitelistedSellers[_seller] = false;
        emit SellerRemovedFromWhitelist(_seller);
    }
    
    /**
     * @dev Check if seller is whitelisted
     * @param _seller Address of the seller
     */
    function isSellerWhitelisted(address _seller)
        external
        view
        returns (bool)
    {
        return whitelistedSellers[_seller];
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = userBalance[owner];
        require(amount > 0, "No fees to withdraw");
        
        userBalance[owner] = 0;
        require(usdc.transfer(owner, amount), "Withdrawal failed");
        
        emit PlatformFeeWithdrawn(owner, amount);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param _newFeePercentage New fee percentage
     */
    function updatePlatformFeePercentage(uint256 _newFeePercentage)
        external
        onlyOwner
    {
        require(_newFeePercentage <= 10, "Fee cannot exceed 10%");
        platformFeePercentage = _newFeePercentage;
    }
    
    /**
     * @dev Get platform balance
     */
    function getPlatformBalance() external view onlyOwner returns (uint256) {
        return userBalance[owner];
    }
    
    /**
     * @dev Get total transactions count
     */
    function getTotalTransactions() external view returns (uint256) {
        return totalTransactions;
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
