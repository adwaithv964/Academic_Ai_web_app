import OpenAI from 'openai';

/**
 * OpenAI Client Configuration
 * Initializes the OpenAI client with API key from environment variables
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Generates a chat completion response based on user input using GPT-5
 * @param {string} userMessage - The user's input message
 * @param {string} systemPrompt - System instructions for the AI
 * @param {string} reasoningEffort - Reasoning level: 'minimal', 'low', 'medium', 'high'
 * @param {string} verbosity - Response detail level: 'low', 'medium', 'high'
 * @returns {Promise<string>} The assistant's response
 */
export async function getChatCompletion(userMessage, systemPrompt = 'You are a helpful academic assistant.', reasoningEffort = 'medium', verbosity = 'medium') {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      reasoning_effort: reasoningEffort, // GPT-5 specific parameter
      verbosity: verbosity, // GPT-5 specific parameter
      max_completion_tokens: 2000
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error in OpenAI chat completion:', error);
    throw error;
  }
}

/**
 * Generates structured academic predictions using GPT-5 with custom JSON schema
 * @param {Object} academicData - Student's academic information
 * @returns {Promise<Object>} Structured prediction data
 */
export async function generateAcademicPrediction(academicData) {
  const systemPrompt = `You are an expert academic advisor and data analyst. Analyze the provided student data and generate comprehensive academic predictions including grade forecasts, risk assessments, and personalized recommendations. Be specific, data-driven, and provide actionable insights.`;

  const userPrompt = `
    Analyze this student's academic data and provide predictions:
    
    Student Information:
    - Current Grade: ${academicData?.currentGrade}%
    - Course: ${academicData?.courseName}
    - Difficulty Level: ${academicData?.difficulty}
    - Remaining Assignments: ${academicData?.remainingAssignments}
    - Exam Weight: ${academicData?.examWeight}%
    - Homework Weight: ${academicData?.homeworkWeight}%
    - Participation Weight: ${academicData?.participationWeight}%
    - Historical Performance: ${academicData?.historicalPerformance}
    - Study Hours per Week: ${academicData?.studyHours}
    - Attendance Rate: ${academicData?.attendanceRate}%
    
    Provide comprehensive analysis including predicted final grade, probability distributions, recommendations, and risk assessment.
  `;

  const predictionSchema = {
    type: 'object',
    properties: {
      predictedGrade: { 
        type: 'number', 
        description: 'Predicted final grade (0-100)' 
      },
      confidence: { 
        type: 'number', 
        minimum: 0, 
        maximum: 1,
        description: 'Confidence level in the prediction (0-1)' 
      },
      letterGrade: { 
        type: 'string', 
        description: 'Predicted letter grade (A, B, C, D, F)' 
      },
      probabilityDistribution: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            grade: { type: 'string' },
            probability: { type: 'number' }
          }
        },
        description: 'Probability distribution across grade ranges'
      },
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            impact: { type: 'string' },
            effort: { type: 'string' },
            timeline: { type: 'string' },
            priority: { type: 'string', enum: ['high', 'medium', 'low'] }
          }
        },
        description: 'Personalized academic recommendations'
      },
      riskFactors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            level: { type: 'string', enum: ['high', 'medium', 'low'] },
            description: { type: 'string' },
            mitigation: { type: 'string' }
          }
        },
        description: 'Risk assessment and mitigation strategies'
      },
      targetGrades: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            letter: { type: 'string' },
            grade: { type: 'number' },
            requiredAverage: { type: 'number' },
            difficulty: { type: 'string' },
            description: { type: 'string' }
          }
        },
        description: 'What is required to achieve different target grades'
      },
      scenarios: {
        type: 'object',
        properties: {
          optimistic: {
            type: 'object',
            properties: {
              finalGrade: { type: 'number' },
              probability: { type: 'number' },
              requirements: { type: 'array', items: { type: 'string' } }
            }
          },
          realistic: {
            type: 'object',
            properties: {
              finalGrade: { type: 'number' },
              probability: { type: 'number' },
              requirements: { type: 'array', items: { type: 'string' } }
            }
          },
          conservative: {
            type: 'object',
            properties: {
              finalGrade: { type: 'number' },
              probability: { type: 'number' },
              requirements: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    },
    required: ['predictedGrade', 'confidence', 'letterGrade', 'probabilityDistribution', 'recommendations', 'riskFactors'],
    additionalProperties: false,
  };

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'academic_prediction',
          schema: predictionSchema,
        },
      },
      reasoning_effort: 'high', // Deep analysis for academic predictions
      verbosity: 'high', // Detailed explanations
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating academic prediction:', error);
    throw error;
  }
}

/**
 * Generates personalized study recommendations using AI
 * @param {Object} studentProfile - Student's academic profile and preferences
 * @returns {Promise<Object>} Personalized recommendations
 */
export async function generateStudyRecommendations(studentProfile) {
  const systemPrompt = `You are an expert educational consultant specializing in personalized learning strategies. Generate specific, actionable study recommendations based on the student's profile, learning style, and academic goals.`;

  const userPrompt = `
    Create personalized study recommendations for this student:
    
    Profile:
    - Current GPA: ${studentProfile?.gpa}
    - Learning Style: ${studentProfile?.learningStyle}
    - Available Study Time: ${studentProfile?.studyTime} hours/week
    - Difficulty Areas: ${studentProfile?.difficulties?.join(', ')}
    - Strengths: ${studentProfile?.strengths?.join(', ')}
    - Goals: ${studentProfile?.goals}
    - Preferred Study Times: ${studentProfile?.preferredTimes}
    
    Provide specific, actionable recommendations.
  `;

  const recommendationSchema = {
    type: 'object',
    properties: {
      dailySchedule: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            time: { type: 'string' },
            activity: { type: 'string' },
            duration: { type: 'string' },
            priority: { type: 'string' }
          }
        }
      },
      studyTechniques: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            effectiveness: { type: 'string' },
            timeCommitment: { type: 'string' }
          }
        }
      },
      resources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string' }
          }
        }
      },
      weeklyGoals: {
        type: 'array',
        items: { type: 'string' }
      }
    },
    required: ['dailySchedule', 'studyTechniques', 'resources', 'weeklyGoals'],
    additionalProperties: false,
  };

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'study_recommendations',
          schema: recommendationSchema,
        },
      },
      reasoning_effort: 'medium',
      verbosity: 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating study recommendations:', error);
    throw error;
  }
}

/**
 * Analyzes uploaded academic documents or images using GPT-5's vision capabilities
 * @param {string|File} image - Image URL or File object
 * @param {string} analysisType - Type of analysis to perform
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeAcademicImage(image, analysisType = 'general') {
  let imageUrl;
  
  if (typeof image === 'string') {
    imageUrl = image;
  } else if (image?.url) {
    imageUrl = image?.url;
  } else if (image instanceof File) {
    imageUrl = URL.createObjectURL(image);
  } else {
    throw new Error("Invalid image format provided");
  }

  const systemPrompts = {
    general: 'Analyze this academic document or image. Provide detailed insights about the content, structure, and any educational elements present.',
    grades: 'Analyze this grade report or transcript. Extract key academic performance indicators, identify trends, and provide insights about academic progress.',
    homework: 'Analyze this homework or assignment. Identify the subject matter, difficulty level, completion quality, and provide constructive feedback.',
    notes: 'Analyze these study notes. Assess organization, completeness, clarity, and suggest improvements for better learning outcomes.',
  };

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5', // Best visual reasoning capabilities
      messages: [
        { 
          role: 'system', 
          content: systemPrompts?.[analysisType] || systemPrompts?.general
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Please analyze this academic image with focus on: ${analysisType}` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      reasoning_effort: 'high', // Deep visual analysis
      verbosity: 'high', // Detailed descriptions
    });

    return {
      analysis: response?.choices?.[0]?.message?.content,
      analysisType,
      imageUrl,
    };
  } catch (error) {
    console.error('Error analyzing academic image:', error);
    throw error;
  }
}

/**
 * Generates streaming chat responses for real-time AI tutoring
 * @param {string} userMessage - Student's question
 * @param {string} subject - Academic subject context
 * @param {Function} onChunk - Callback to handle each streamed chunk
 */
export async function streamAcademicTutoring(userMessage, subject, onChunk) {
  const systemPrompt = `You are an expert ${subject} tutor. Provide clear, educational responses that help students understand concepts step-by-step. Use examples and analogies when helpful.`;

  try {
    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      reasoning_effort: 'minimal', // For faster streaming
      verbosity: 'medium',
    });

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error in streaming academic tutoring:', error);
    throw error;
  }
}

/**
 * Creates embeddings for academic content search and similarity
 * @param {string|Array} content - Text content to embed
 * @returns {Promise<Array>} Embedding vectors
 */
export async function createAcademicEmbeddings(content) {
  try {
    const response = await openai?.embeddings?.create({
      model: 'text-embedding-3-small',
      input: Array.isArray(content) ? content : [content],
    });

    return Array.isArray(content) 
      ? response?.data?.map(item => item?.embedding)
      : response?.data?.[0]?.embedding;
  } catch (error) {
    console.error('Error creating academic embeddings:', error);
    throw error;
  }
}

/**
 * Moderates academic content for inappropriate material
 * @param {string} text - Content to moderate
 * @returns {Promise<Object>} Moderation results
 */
export async function moderateAcademicContent(text) {
  try {
    const response = await openai?.moderations?.create({
      model: 'text-moderation-latest',
      input: text,
    });

    return response?.results?.[0];
  } catch (error) {
    console.error('Error moderating academic content:', error);
    throw error;
  }
}

export default openai;