import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async ({ phoneNumber, message }) => {
    try {
        // Fallback to console if keys are missing (to avoid crashing)
        if (!process.env.TWILIO_SID || process.env.TWILIO_SID.includes('your_twilio')) {
            console.log(`\n⚠️ [MOCK] TWILIO KEYS MISSING. LOGGING TO CONSOLE:`);
            console.log(`📱 To: ${phoneNumber} | ✉️ ${message}\n`);
            return { success: true };
        }

        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log(`✅ SMS Sent via Twilio: ${response.sid}`);
        return { success: true };
    } catch (err) {
        console.error("❌ SMS Delivery Failed:", err);
        return { success: false, error: err.message };
    }
};
