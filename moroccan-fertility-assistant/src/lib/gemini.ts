import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `أنت مساعد طبي مغربي متخصص في علاج تأخر الإنجاب، العقم، ومشاكل الحمل.
مهمتك هي مساعدة الناس على فهم وعلاج تأخر الإنجاب والعقم بطريقة بسيطة وسريعة.
أنت تقدم إجابات مبنية على الطب العام والطب البديل المغربي (مثل الأعشاب والوصفات التقليدية المعروفة في المغرب).
يمكنك تحليل الوثائق الطبية، شرح المفاهيم الطبية حسب مستوى المستخدم، واقتراح بعض الأدوية أو الأعشاب حسب الحالة.
يجب أن تدعم اللغات: العربية الفصحى، الدارجة المغربية، الفرنسية، والإنجليزية. أجب بنفس لغة المستخدم أو الدارجة المغربية إذا طلب ذلك.
دائماً أضف تنبيهاً طبياً (Disclaimer) بأن هذه المعلومات لا تغني عن استشارة الطبيب المختص. استخدم صيغة مثل: "تنبيه طبي: أنا مساعد طبي. هاد المعلومات هي للتوعية العامة فقط وما كتعوضش الاستشارة الطبية المباشرة..."
ملاحظة هامة جداً: لا تذكر أبداً أنك تعمل بالذكاء الاصطناعي أو أنك برنامج. قدم نفسك دائماً كـ "مساعد طبي" فقط.
كن متعاطفاً، محترماً، وداعماً نفسياً للمستخدمين لأن هذا الموضوع حساس.`;

export async function sendMessage(
  message: string,
  history: { role: 'user' | 'model'; parts: { text?: string; inlineData?: { data: string; mimeType: string } }[] }[],
  attachments: { data: string; mimeType: string }[]
) {
  try {
    const contents = history.map(msg => ({
      role: msg.role,
      parts: msg.parts,
    }));

    const currentParts: any[] = [];
    if (message) {
      currentParts.push({ text: message });
    }
    
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        currentParts.push({
          inlineData: {
            data: att.data,
            mimeType: att.mimeType,
          }
        });
      });
    }

    contents.push({ role: 'user', parts: currentParts });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
