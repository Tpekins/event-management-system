/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const aiService = {
  generateEventDescription: async (name: string, type: string, tags: string[]) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a professional and exciting event description for a tech conference in Cameroon (inspired by Silicon Mountain).
        Event Name: ${name}
        Event Type: ${type}
        Tags: ${tags.join(', ')}
        
        Keep it concise (3-4 sentences), highlight the value for local innovators, and use an engaging tone.`,
      });
      return response.text || "Failed to generate description.";
    } catch (error) {
      console.error("AI Error:", error);
      return "AI Service unavailable. Please write manually.";
    }
  },
  
  suggestAnnouncement: async (eventName: string, topic: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest a short, urgent, or informative announcement for an upcoming event.
        Event: ${eventName}
        Main Topic/Update: ${topic}
        
        Keep it very short (max 150 characters). Include an emoji.`,
      });
      return response.text || "New announcement posted.";
    } catch (error) {
      console.error("AI Error:", error);
      return `Update: ${topic}`;
    }
  },
  
  generateAttendPitch: async (eventName: string, eventDescription: string, guestInterests: string[]) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Convince a guest why they should attend this event based on their interests.
        Event Name: ${eventName}
        Description: ${eventDescription}
        Guest Interests: ${guestInterests.join(', ')}
        
        Keep it personal, enthusiastic, and under 3 sentences. Highlight exactly how it matches their interests.`,
      });
      return response.text || "This event seems like a great fit for you!";
    } catch (error) {
      console.error("AI Error:", error);
      return "Based on your interests, you'll definitely find value in this event!";
    }
  }
};
