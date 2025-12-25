import { StreamChat } from 'stream-chat';
import "dotenv/config";

// Fixed: Use STREAM instead of STEAM
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key and secret must be set in environment variables");
  console.error("Missing:", { apiKey: !!apiKey, apiSecret: !!apiSecret });
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Fixed: Renamed from upsertSteamUser to upsertStreamUser
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    console.log(`Stream user upserted: ${userData.id}`);
    return userData;
  } catch (error) {
    console.error("Error creating Stream user:", error);
    throw error; // Re-throw to handle in calling function
  }
};

export const createUserToken = (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to create token");
    }
    return streamClient.createToken(userId);
  } catch (error) {
    console.error("Error creating user token:", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    // Ensure user exists in Stream
    const userIdStr = String(userId); // Convert to string if necessary
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    
  }
}

export { streamClient };