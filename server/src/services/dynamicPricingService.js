import axios from "axios";
import CarbonCredit from "../models/Listing.js";
import EcoProduct from "../models/EcoProduct.js";
import transactionsModel from "../models/transactionsModel.js";
import userModel from "../models/userModel.js";
import DynamicPrice from "../models/DynamicPrice.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Calculate market metrics for dynamic pricing
 */
const calculateMarketMetrics = async (listing, isProduct = false) => {
  try {
    const projectType = isProduct ? listing.category : listing.projectType;
    const basePrice = isProduct ? listing.price : listing.pricePerCredit;

    // Calculate demand score (popularity of similar items)
    const similarItems = await (
      isProduct ? EcoProduct : CarbonCredit
    ).countDocuments({
      [isProduct ? "category" : "projectType"]: projectType,
      status: isProduct ? "Active" : "Available",
    });

    // Calculate supply score
    const totalSupply = await (isProduct ? EcoProduct : CarbonCredit).aggregate(
      [
        {
          $match: {
            [isProduct ? "category" : "projectType"]: projectType,
            status: isProduct ? "Active" : "Available",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: isProduct ? "$stock" : "$quantity" },
          },
        },
      ],
    );

    // Recent transaction prices (market trend)
    const recentTransactions = await transactionsModel
      .find({
        ...(isProduct ? {} : { listing: listing._id }),
        purchaseDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      })
      .select("pricePerCredit quantity")
      .sort({ purchaseDate: -1 })
      .limit(20);

    // Seller ratings
    const seller = await userModel.findById(listing.seller || listing.addedBy);
    const sellerRating = seller?.ratings?.average || 3.5;

    // Calculate metrics
    const demandScore = Math.min(similarItems * 5, 100);
    const supplyQuantity = totalSupply[0]?.total || 0;
    const supplyScore = Math.max(100 - (supplyQuantity / 1000) * 10, 10);

    // Price trend (average of recent transactions)
    const avgRecentPrice =
      recentTransactions.length > 0
        ? recentTransactions.reduce((sum, t) => sum + t.pricePerCredit, 0) /
          recentTransactions.length
        : basePrice;

    const trendFactor = avgRecentPrice / basePrice;

    // Age decay (older listings get slight discount)
    const ageInDays =
      (Date.now() - new Date(listing.createdAt)) / (24 * 60 * 60 * 1000);
    const timeDecay = Math.max(0.9, 1 - ageInDays / 100);

    return {
      demandScore,
      supplyScore,
      sellerRating,
      recentTransactionCount: recentTransactions.length,
      avgRecentPrice,
      trendFactor,
      timeDecay,
      similarItemsCount: similarItems,
      totalSupplyQuantity: supplyQuantity,
    };
  } catch (error) {
    console.error("Error calculating market metrics:", error);
    return null;
  }
};

/**
 * Use Gemini AI to recommend dynamic pricing
 */
const getAIRecommendedPrice = async (listing, metrics, isProduct = false) => {
  const MAX_RETRIES = 3;
  const BASE_DELAY = 1000; // 1 second

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (!GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not configured");
        return listing[isProduct ? "price" : "pricePerCredit"];
      }

      const basePrice = isProduct ? listing.price : listing.pricePerCredit;
      const projectType = isProduct ? listing.category : listing.projectType;
      console.log(
        `[AI Pricing] Calculating dynamic price for ${isProduct ? "product" : "listing"}: ${listing._id}, Base Price: ₹${basePrice}`,
      );

      const prompt = `You are an expert in dynamic pricing for carbon credits and eco-products. 
    
Analyze the following market data and provide a recommended price adjustment:

PRODUCT INFO:
- Type: ${isProduct ? "Eco Product" : "Carbon Credit Listing"}
- Category: ${projectType}
- Base Price: ₹${basePrice}
- ${isProduct ? `Stock: ${listing.stock}` : `Quantity: ${listing.quantity}`}
- Seller Rating: ${metrics.sellerRating}/5

MARKET METRICS:
- Demand Score: ${metrics.demandScore}/100 (higher = higher demand)
- Supply Score: ${metrics.supplyScore}/100 (higher = more supply available)
- Similar Items: ${metrics.similarItemsCount}
- Recent Transaction Average Price: ₹${metrics.avgRecentPrice.toFixed(2)}
- Market Trend: ${metrics.trendFactor > 1 ? "UPWARD" : "DOWNWARD"} (${(metrics.trendFactor * 100).toFixed(1)}% of recent average)
- Age Decay Factor: ${(metrics.timeDecay * 100).toFixed(1)}%
- Recent Sales: ${metrics.recentTransactionCount} in last 30 days

Based on this data, provide your analysis in the following JSON format ONLY:
{
  "recommendedPrice": <number>,
  "priceMultiplier": <number between 0.5 and 2>,
  "marketTemperature": "<cold|cool|moderate|warm|hot>",
  "demandFactor": <0-1>,
  "supplyFactor": <0-1>,
  "rateFactor": <0-1>,
  "verificationFactor": <0-1>,
  "trendFactor": <0-1>,
  "reasoning": "<brief explanation in max 100 chars>"
}

Consider:
1. High demand + low supply = higher price (premium)
2. Low demand + high supply = lower price (discount)
3. Good seller rating = can command premium
4. Market trend following
5. Age decay for older listings
6. Realistic market bounds (0.5x to 2x base price)

Return ONLY the JSON, no other text.`;

      const response = await axios.post(
        `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        { timeout: 30000 },
      );

      const responseText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        console.warn("No response from Gemini API");
        console.warn(
          "Gemini Response:",
          JSON.stringify(response.data, null, 2),
        );
        return basePrice;
      }

      console.log(
        `[AI Pricing] Gemini Response Text: ${responseText.substring(0, 200)}...`,
      );

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn("Could not parse JSON from Gemini response");
        console.warn("Full Response:", responseText);
        return basePrice;
      }

      const result = JSON.parse(jsonMatch[0]);
      console.log(
        `[AI Pricing] Parsed Result - Recommended Price: ₹${result.recommendedPrice}, Multiplier: ${result.priceMultiplier}, Temp: ${result.marketTemperature}`,
      );
      return {
        recommendedPrice: Math.max(
          basePrice * 0.5,
          Math.min(result.recommendedPrice, basePrice * 2),
        ),
        priceMultiplier: result.priceMultiplier,
        marketTemperature: result.marketTemperature,
        factors: {
          demandFactor: result.demandFactor,
          supplyFactor: result.supplyFactor,
          rateFactor: result.rateFactor,
          verificationFactor: result.verificationFactor,
          trendFactor: result.trendFactor,
          timeDecayFactor: metrics.timeDecay,
        },
        reasoning: result.reasoning,
      };
    } catch (error) {
      const delay = BASE_DELAY * Math.pow(2, attempt);
      if (error.response?.status === 429 && attempt < MAX_RETRIES - 1) {
        console.warn(
          `[AI Pricing] Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      if (attempt === MAX_RETRIES - 1) {
        console.error(
          `[AI Pricing] Max retries exceeded for listing ${listing._id}:`,
          error.message,
        );
        break;
      }
    }
  }

  // Fallback: return base price if all retries failed
  console.warn(
    `[AI Pricing] Falling back to base price for listing ${listing._id}`,
  );
  return listing[isProduct ? "price" : "pricePerCredit"];
};

/**
 * Calculate dynamic price for a listing or product
 */
export const calculateDynamicPrice = async (listingId, isProduct = false) => {
  try {
    const model = isProduct ? EcoProduct : CarbonCredit;
    // EcoProduct uses 'addedBy', CarbonCredit uses 'seller'
    const populateField = isProduct ? "addedBy" : "seller";
    const listing = await model
      .findById(listingId)
      .populate(populateField, "ratings");

    if (!listing) {
      return { success: false, message: "Listing not found" };
    }

    // Calculate market metrics
    const metrics = await calculateMarketMetrics(listing, isProduct);
    if (!metrics) {
      return { success: false, message: "Could not calculate market metrics" };
    }

    // Get AI recommendation
    const aiRecommendation = await getAIRecommendedPrice(
      listing,
      metrics,
      isProduct,
    );
    if (!aiRecommendation) {
      return { success: false, message: "Could not get AI recommendation" };
    }

    // Handle fallback case where aiRecommendation is just a number (base price)
    const recommendedPrice =
      typeof aiRecommendation === "number"
        ? aiRecommendation
        : aiRecommendation.recommendedPrice;

    const aiData =
      typeof aiRecommendation === "number"
        ? {
            recommendedPrice,
            priceMultiplier: 1.0,
            marketTemperature: "moderate",
            factors: {
              demandFactor: 0.5,
              supplyFactor: 0.5,
              rateFactor: 0.5,
              verificationFactor: 0.5,
              trendFactor: 1.0,
              timeDecayFactor: metrics.timeDecay,
            },
            reasoning: "Fallback: Using base price due to API issues",
          }
        : aiRecommendation;

    // Store or update dynamic pricing
    const basePrice = isProduct ? listing.price : listing.pricePerCredit;
    const dynamicPriceDoc = await DynamicPrice.findOneAndUpdate(
      { [isProduct ? "product" : "listing"]: listingId },
      {
        [isProduct ? "product" : "listing"]: listingId,
        basePrice,
        recommendedPrice: aiData.recommendedPrice,
        priceMultiplier: aiData.priceMultiplier,
        demandScore: metrics.demandScore,
        supplyScore: metrics.supplyScore,
        marketTemperature: aiData.marketTemperature,
        factors: aiData.factors,
        lastUpdatedAt: new Date(),
        $push: {
          priceHistory: {
            price: aiData.recommendedPrice,
            timestamp: new Date(),
            reason: aiData.reasoning,
          },
        },
      },
      { upsert: true, new: true },
    );

    console.log(
      `[AI Pricing] Saved Dynamic Price - Base: ₹${basePrice}, Recommended: ₹${aiData.recommendedPrice}, Savings: ₹${basePrice - aiData.recommendedPrice}`,
    );

    return {
      success: true,
      data: {
        basePrice,
        recommendedPrice: aiData.recommendedPrice,
        priceMultiplier: aiData.priceMultiplier,
        currentMarketTemperature: aiData.marketTemperature,
        savings: basePrice - aiData.recommendedPrice,
        demandScore: metrics.demandScore,
        supplyScore: metrics.supplyScore,
        sellerRating: metrics.sellerRating,
        recentSales: metrics.recentTransactionCount,
        factors: aiData.factors,
        reasoning: aiData.reasoning,
      },
    };
  } catch (error) {
    console.error("Error calculating dynamic price:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get stored dynamic pricing info
 */
export const getDynamicPrice = async (listingId, isProduct = false) => {
  try {
    const query = isProduct ? { product: listingId } : { listing: listingId };
    const dynamicPrice = await DynamicPrice.findOne(query);

    if (!dynamicPrice) {
      return {
        success: false,
        message: "No dynamic pricing data found",
      };
    }

    return {
      success: true,
      data: {
        basePrice: dynamicPrice.basePrice,
        recommendedPrice: dynamicPrice.recommendedPrice,
        priceMultiplier: dynamicPrice.priceMultiplier,
        currentMarketTemperature: dynamicPrice.marketTemperature,
        demandScore: dynamicPrice.demandScore,
        supplyScore: dynamicPrice.supplyScore,
        savings: dynamicPrice.basePrice - dynamicPrice.recommendedPrice,
        factors: dynamicPrice.factors,
        lastUpdatedAt: dynamicPrice.lastUpdatedAt,
        priceHistory: dynamicPrice.priceHistory.slice(-10), // Last 10 prices
      },
    };
  } catch (error) {
    console.error("Error fetching dynamic price:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Batch update all listings with dynamic pricing
 */
export const updateAllDynamicPrices = async () => {
  try {
    const listings = await CarbonCredit.find({ status: "Available" }).select(
      "_id",
    );
    const products = await EcoProduct.find({ status: "Active" }).select("_id");

    const results = {
      listings: 0,
      products: 0,
      errors: 0,
    };

    // Update listings
    for (const listing of listings) {
      const result = await calculateDynamicPrice(listing._id, false);
      if (result.success) results.listings++;
      else results.errors++;
    }

    // Update products
    for (const product of products) {
      const result = await calculateDynamicPrice(product._id, true);
      if (result.success) results.products++;
      else results.errors++;
    }

    return {
      success: true,
      message: `Updated dynamic pricing for ${results.listings} listings and ${results.products} products`,
      results,
    };
  } catch (error) {
    console.error("Error batch updating dynamic prices:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get market insights (aggregated data across all listings)
 */
export const getMarketInsights = async () => {
  try {
    const dynamicPrices = await DynamicPrice.aggregate([
      {
        $group: {
          _id: null,
          avgPriceChange: {
            $avg: {
              $subtract: ["$recommendedPrice", "$basePrice"],
            },
          },
          avgDemandScore: { $avg: "$demandScore" },
          avgSupplyScore: { $avg: "$supplyScore" },
          temperatureDistribution: {
            $push: "$marketTemperature",
          },
          priceMultiplierMin: { $min: "$priceMultiplier" },
          priceMultiplierMax: { $max: "$priceMultiplier" },
          priceMultiplierAvg: { $avg: "$priceMultiplier" },
        },
      },
    ]);

    if (!dynamicPrices.length) {
      return {
        success: false,
        message: "No market data available",
      };
    }

    const data = dynamicPrices[0];
    const tempDist = data.temperatureDistribution.reduce((acc, temp) => {
      acc[temp] = (acc[temp] || 0) + 1;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        averagePriceChange: data.avgPriceChange,
        averageDemandScore: data.avgDemandScore,
        averageSupplyScore: data.avgSupplyScore,
        temperatureDistribution: tempDist,
        priceMultiplierRange: {
          min: data.priceMultiplierMin,
          max: data.priceMultiplierMax,
          avg: data.priceMultiplierAvg,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching market insights:", error);
    return { success: false, message: error.message };
  }
};
