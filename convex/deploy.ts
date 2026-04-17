import { action } from "./_generated/server";
import { v } from "convex/values";

export const triggerVercelDeploy = action({
  args: {},
  handler: async (ctx) => {
    console.log("Triggering Vercel Deployment via Deploy Hook...");
    const DEPLOY_HOOK_URL = "https://api.vercel.com/v1/integrations/deploy/prj_wRTqRoAug4H7T3a2Ag3zEtqLIlQQ/8RzZVHo4Dd";
    
    try {
      const response = await fetch(DEPLOY_HOOK_URL, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Vercel deploy hook failed: ${response.statusText}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Vercel deployment trigger failed:", error);
      throw error;
    }
  },
});
