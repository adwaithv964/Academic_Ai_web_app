import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './AppIcon';
import Button from './ui/Button';
import { useAI } from '../hooks/useAI';

/**
 * AI Image Analyzer Component
 * Analyzes academic documents, grades, and study materials using AI vision
 */
const AIImageAnalyzer = ({ onAnalysisComplete = () => { }, className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisType, setAnalysisType] = useState('general');
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);
  const { analyzeImage, loading, error, resetState } = useAI();

  const analysisTypes = [
    { value: 'general', label: 'General Analysis', description: 'Overall document analysis' },
    { value: 'grades', label: 'Grade Report', description: 'Analyze transcripts and grade reports' },
    { value: 'homework', label: 'Assignment', description: 'Review homework and assignments' },
    { value: 'notes', label: 'Study Notes', description: 'Analyze study materials and notes' }
  ];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFile(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFile = (file) => {
    if (!file?.type?.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader?.result);
    reader?.readAsDataURL(file);

    // Reset previous analysis
    setAnalysisResult(null);
    resetState();
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFile(e?.target?.files?.[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      const result = await analyzeImage(selectedFile, analysisType);
      setAnalysisResult(result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysisResult(null);
    resetState();
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? 'border-primary bg-primary/5'
          : selectedFile
            ? 'border-green-300 bg-green-50' : 'border-border hover:border-primary/50'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          {preview ? (
            <div className="space-y-4">
              <div className="max-w-xs mx-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg border border-border"
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <Icon name="CheckCircle" size={16} />
                <span>{selectedFile?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  iconName="X"
                  className="h-6 w-6 p-0 ml-2"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Upload" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-1">
                  Upload Academic Document
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop an image here, or click to browse
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Analysis Type Selection */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-foreground">Analysis Type</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysisTypes?.map((type) => (
              <div
                key={type?.value}
                onClick={() => setAnalysisType(type?.value)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${analysisType === type?.value
                  ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
              >
                <div className="font-medium text-sm text-foreground">{type?.label}</div>
                <div className="text-xs text-muted-foreground">{type?.description}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {/* Analyze Button */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            iconName={loading ? 'Loader2' : 'Eye'}
            className={loading ? 'animate-spin' : ''}
          >
            {loading ? 'Analyzing...' : 'Analyze Document'}
          </Button>
        </motion.div>
      )}
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive mb-1">Analysis Error</h4>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Icon name="Brain" size={20} className="text-primary" />
              <h4 className="font-medium text-foreground">AI Analysis Results</h4>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="prose prose-sm max-w-none">
                {analysisResult?.analysis?.split('\n').map((line, i) => {
                  // Handle bullet points
                  const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
                  const cleanLine = isBullet ? line.trim().substring(2) : line;

                  // Handle bold text (**text**)
                  const parts = cleanLine.split(/\*\*(.*?)\*\*/g);

                  return (
                    <div key={i} className={`min-h-[1.5em] ${isBullet ? 'flex gap-2 ml-1' : ''}`}>
                      {isBullet && <span className="text-primary/70">•</span>}
                      <span className="break-words">
                        {parts.map((part, j) =>
                          // Even indices are normal text, odd are bold (captured groups)
                          j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Analysis Type: {analysisTypes?.find(t => t?.value === analysisResult?.analysisType)?.label}</span>
                  <span>{new Date()?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIImageAnalyzer;