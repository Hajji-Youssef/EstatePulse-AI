
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { predictHousePrice } from "./housePriceModel";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Define the function that Gemini can call to predict prices
const predictPriceFunction: FunctionDeclaration = {
  name: 'getHousePricePrediction',
  description: 'Calculate the estimated market value of a house based on its physical characteristics and location quality using a regression engine.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      sqft: {
        type: Type.NUMBER,
        description: 'Total interior square footage of the house.'
      },
      bedrooms: {
        type: Type.NUMBER,
        description: 'Total number of bedrooms.'
      },
      bathrooms: {
        type: Type.NUMBER,
        description: 'Total number of bathrooms (including half-baths).'
      },
      yearBuilt: {
        type: Type.NUMBER,
        description: 'The year the house was originally constructed (e.g., 1995).'
      },
      locationQuality: {
        type: Type.STRING,
        description: 'General quality of the neighborhood/location.',
        enum: ['low', 'medium', 'high', 'luxury']
      }
    },
    required: ['sqft', 'bedrooms', 'bathrooms', 'yearBuilt', 'locationQuality']
  }
};

export const startChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are EstatePulse AI, a professional real-estate valuation assistant. 
      Your goal is to help users estimate their house value. 
      
      1. Be friendly and conversational.
      2. If the user provides partial info, ask for the missing details (sqft, bedrooms, bathrooms, year built, location quality).
      3. Once you have all the data, call the 'getHousePricePrediction' tool.
      4. After getting the prediction result from the tool, explain it to the user with a helpful summary of why the price is what it is based on the features they provided.
      5. Don't mention you are a 'model' or 'AI' unless asked. Act like a consultant.`,
      tools: [{ functionDeclarations: [predictPriceFunction] }]
    }
  });
};

export const handleGeminiResponse = async (chat: any, message: string) => {
  // Initial message to Gemini
  const result = await chat.sendMessage({ message });
  
  // Check if Gemini wants to call a function
  if (result.functionCalls && result.functionCalls.length > 0) {
    const call = result.functionCalls[0];
    
    if (call.name === 'getHousePricePrediction') {
      // Execute the local regression model
      const prediction = predictHousePrice(call.args as any);
      
      // Since sendToolResponse is not available on the standard Chat object, 
      // we feed the result back to Gemini via a follow-up message to get the natural language explanation.
      const explanationResult = await chat.sendMessage({ 
        message: `VALUATION_ENGINE_RESULT: The house is estimated at $${prediction.estimatedPrice.toLocaleString()}. 
        Market trend: ${prediction.marketTrend}. Confidence: ${Math.round(prediction.confidenceScore * 100)}%.
        Please explain this valuation to the user in a professional and encouraging way.`
      });
      
      return {
        text: explanationResult.text,
        prediction: prediction
      };
    }
  }

  // Return standard text response if no function was called
  return {
    text: result.text,
    prediction: null
  };
};
