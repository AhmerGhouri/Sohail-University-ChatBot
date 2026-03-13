import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';
import universityData from '@/lib/university_data.json';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HF_API_TOKEN);

const SYSTEM_PROMPT = `You are the Official Sohail University AI Assistant. Your primary goal is to provide accurate, helpful, and professional information academic programs, admissions, campus life, and general inquiries related to Sohail University.

CONSTRAINTS:
1. Only answer queries related to Sohail University or general educational guidance.
2. If a user asks something completely unrelated to education or the university, politely inform them that you are specialized in Sohail University matters.
3. Use the details from the Knowledge Base below to provide precise information.
4. Maintain a polite, encouraging, and academic tone.

KNOWLEDGE BASE:
${JSON.stringify(universityData, null, 2)}

Ensure you answer concisely and correctly based on this data.`;

export async function POST(req: Request) {
  // Check for API token
  if (!process.env.HF_API_TOKEN) {
    return NextResponse.json(
      { error: 'Missing HF_API_TOKEN in environment variables' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Prepend system message if not present
    const updatedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Call Hugging Face Inference API
    const response = await hf.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: updatedMessages,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
