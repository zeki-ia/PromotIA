import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  const { comments } = await request.json();

  const commentsText = comments.map(c => `Score ${c.score}: "${c.text}"`).join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Sos experto en Customer Success B2B. Analizá estos comentarios NPS y devolvé SOLO JSON válido sin texto extra:
{"resumen":"frase corta del estado del NPS","positivos":["punto fuerte 1","punto fuerte 2"],"problemas":["problema 1","problema 2"],"acciones":[{"accion":"acción concreta 1","impacto":"alto"},{"accion":"acción concreta 2","impacto":"medio"}]}

Comentarios:
${commentsText}`,
    }],
  });

  let text = message.content[0].text.replace(/```json|```/g, "").trim();
  const insights = JSON.parse(text);

  return NextResponse.json(insights);
}
