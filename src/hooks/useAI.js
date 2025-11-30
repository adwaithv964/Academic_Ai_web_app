import { useState, useCallback } from 'react';
import { chat as chatApi, analyzeImage as analyzeApi } from '../services/ai';
import { predictGrades as predictApi } from '../services/api';

/**
 * Custom React hook for AI integration
 * Provides state management and error handling for AI operations
 */
export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const resetState = useCallback(() => {
        setError(null);
        setResponse(null);
    }, []);

    const handleError = useCallback((error) => {
        console.error('AI Error:', error);
        let errorMessage = 'An error occurred while processing your request.';

        if (error?.code === 'insufficient_quota') {
            errorMessage = 'AI API quota exceeded. Please check your API usage.';
        } else if (error?.code === 'invalid_api_key') {
            errorMessage = 'Invalid AI API key. Please check your configuration.';
        } else if (error?.code === 'rate_limit_exceeded') {
            errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
        } else if (error?.message) {
            errorMessage = error?.message;
        }

        setError(errorMessage);
        setLoading(false);
    }, []);

    const predictGrades = useCallback(async (academicData) => {
        try {
            setLoading(true);
            setError(null);
            const prediction = await predictApi(academicData);
            setResponse(prediction);
            return prediction;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const getStudyRecommendations = useCallback(async (studentProfile) => {
        try {
            setLoading(true);
            setError(null);
            const prompt = `Create personalized study recommendations.\n\nProfile:\n- Current GPA: ${studentProfile?.gpa}\n- Learning Style: ${studentProfile?.learningStyle}\n- Available Study Time: ${studentProfile?.studyTime} hours/week\n- Difficulty Areas: ${(studentProfile?.difficulties || []).join(', ')}\n- Strengths: ${(studentProfile?.strengths || []).join(', ')}\n- Goals: ${studentProfile?.goals}\n- Preferred Study Times: ${studentProfile?.preferredTimes}`;
            const res = await chatApi(prompt, 'study-recommendations');
            const recommendations = { text: res?.text || '' };
            setResponse(recommendations);
            return recommendations;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const chatWithAI = useCallback(async (message, subject) => {
        try {
            setLoading(true);
            setError(null);
            const res = await chatApi(message, subject);
            const text = res?.text || '';
            setResponse(text);
            return text;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const analyzeImage = useCallback(async (image, analysisType) => {
        try {
            setLoading(true);
            setError(null);
            const analysis = await analyzeApi(image, analysisType);
            setResponse(analysis);
            return analysis;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const startTutoringSession = useCallback(async (question, subject, onStreamChunk) => {
        try {
            setLoading(true);
            setError(null);
            const res = await chatApi(question, subject);
            const text = res?.text || '';
            if (typeof onStreamChunk === 'function') {
                onStreamChunk(text);
            }
            setResponse(text);
            return text;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const createEmbeddings = useCallback(async () => {
        const err = new Error('Embeddings are not supported in the current configuration');
        handleError(err);
        throw err;
    }, [handleError]);

    const moderateContent = useCallback(async () => {
        const err = new Error('Moderation is not supported in the current configuration');
        handleError(err);
        throw err;
    }, [handleError]);

    return {
        // State
        loading,
        error,
        response,

        // Actions
        predictGrades,
        getStudyRecommendations,
        chatWithAI,
        analyzeImage,
        startTutoringSession,
        createEmbeddings,
        moderateContent,
        resetState,
    };
};

export default useAI;
