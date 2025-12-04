import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType, TransactionStatus, Currency } from '../types';
import { BANK_APPS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseNotificationText = async (text: string, activeAppIds: string[] = []): Promise<Partial<Transaction> | null> => {
  try {
    // Filter the full list of apps to just the ones the user has "installed" (selected)
    const knownApps = BANK_APPS.filter(app => activeAppIds.length === 0 || activeAppIds.includes(app.id));
    const appNames = knownApps.map(app => app.name).join(", ");
    
    const prompt = `
      Actúa como un parser inteligente de notificaciones financieras peruanas. 
      Analiza el siguiente texto (SMS, notificación push o correo) de una transacción.
      
      El usuario tiene estas aplicaciones activas: ${appNames}. Prioriza reconocer estas entidades.

      Texto a analizar: "${text}"

      Reglas Estrictas:
      1. Determina si es ingreso (isExpense: false) o egreso (isExpense: true).
         - "Yapeaste", "Pagaste", "Transferencia realizada", "Pago exitoso" => Egreso (isExpense: true)
         - "Recibiste", "Te enviaron", "Abono", "Ingreso" => Ingreso (isExpense: false)
      2. Extrae el monto numérico exacto.
      3. Identifica la entidad financiera (Yape, Plin, BCP, BBVA, etc.) basándote en el texto.
      4. Extrae el código de operación si existe.
      5. Extrae el nombre de la persona o empresa relacionada.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            currency: { type: Type.STRING, enum: [Currency.PEN, Currency.USD] },
            type: { type: Type.STRING, enum: Object.values(TransactionType) },
            entity: { type: Type.STRING },
            senderOrReceiver: { type: Type.STRING },
            operationCode: { type: Type.STRING },
            description: { type: Type.STRING },
            isExpense: { type: Type.BOOLEAN },
          },
          required: ["amount", "currency", "isExpense", "entity"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      
      // Try to match the returned entity name to our known ID list
      const matchedApp = BANK_APPS.find(app => 
        app.name.toLowerCase().includes(data.entity.toLowerCase()) || 
        data.entity.toLowerCase().includes(app.name.toLowerCase())
      );

      return {
        ...data,
        status: TransactionStatus.SUCCESS,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        id: crypto.randomUUID(),
        originAppId: matchedApp?.id
      };
    }
    return null;

  } catch (error) {
    console.error("Error parsing with Gemini:", error);
    return null;
  }
};