import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

// Rich text editor imports (placeholders for now)
// You would typically use a library like 'react-quill', 'draft-js', or 'tiptap'
// For simplicity, I'll use a textarea and basic styling buttons.
import { Bold, Italic, Heading1, Heading2, Quote, Image, List, ListOrdered, Upload, Cloud, CloudUpload, Send } from 'lucide-react';

interface RationaleProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: { text?: string; file?: File }) => void;
}

const Rationale: React.FC<RationaleProps> = ({ isOpen, onClose, onSave }) => {
    const [textInput, setTextInput] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState<{ text?: string; file?: File } | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (uploadedFile) {
            const url = URL.createObjectURL(uploadedFile);
            setPdfUrl(url);
            return () => {
                URL.revokeObjectURL(url);
                setPdfUrl(null);
            };
        }
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }
        };
    }, [uploadedFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > 10 * 1024 * 1024) { // Max 10 MB
                alert('File size exceeds 10 MB limit.');
                return;
            }
            setUploadedFile(file);
            setTextInput(''); // Clear text if a file is uploaded
            simulateUpload();
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                if (file.size > 10 * 1024 * 1024) { // Max 10 MB
                    alert('File size exceeds 10 MB limit.');
                    return;
                }
                setUploadedFile(file);
                setTextInput(''); // Clear text if a file is uploaded
                simulateUpload();
            } else {
                alert('Only PDF files are allowed.');
            }
        }
    }, []);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
            }
        }, 200);
    };

    const handlePreview = () => {
        if (textInput.trim().length > 0) {
            setPreviewContent({ text: textInput });
            setShowPreview(true);
        } else if (uploadedFile) {
            setPreviewContent({ file: uploadedFile });
            setShowPreview(true);
        }
    };

    const handleSend = () => {
        if (previewContent) {
            onSave(previewContent);
        }
        setShowPreview(false);
        onClose();
    };

    const isPreviewEnabled = textInput.trim().length > 0 || uploadedFile !== null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col gap-0 pb-2 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className='text-md -mt-2 !font-medium'>Rationale</DialogTitle>
                </DialogHeader>

                {!showPreview ? (
                    <>
                        <div className="flex-grow flex flex-col rounded-md relative"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}>
                            {uploadedFile ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    {isUploading ? (
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                            <p className="mt-2 text-sm text-gray-500">Uploading {uploadedFile.name} ({uploadProgress}%)</p>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-medium">File loaded: {uploadedFile.name}</p>
                                    )}
                                    <Button variant="ghost" onClick={() => setUploadedFile(null)} className="mt-4">
                                        Remove File
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        className="flex-grow w-full mt-2 p-2.5 text-sm text-gray-700 border-1 rounded-md focus:outline-none resize-none"
                                        value={textInput}
                                        placeholder='Start typing...'
                                        onChange={(e) => setTextInput(e.target.value)}
                                    />
                                    <div className="relative flex justify-center items-center my-2">
                                        <div className="absolute w-full border-t border-gray-300"></div>
                                        <span className="relative bg-white px-4 text-gray-500">or</span>
                                    </div>
                                    <div className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md ${isUploading ? 'border-gray-200 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-gray-400'}`}>
                                        <Label htmlFor="file-upload" className={`flex flex-col items-center ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                            <CloudUpload className={`${isUploading ? 'text-gray-300' : 'text-gray-500'}`} size={20} />
                                            <span className={`${isUploading ? 'text-gray-400' : 'text-purple-600 font-medium'}`}>
                                                {isUploading ? 'Uploading...' : 'Upload file'}
                                            </span>
                                            <span className="text-sm text-gray-500">Or, drag and drop a PDF (max. 10 MB)</span>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept="application/pdf"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                disabled={isUploading}
                                            />
                                        </Label>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center px-2 pt-2  py-0 my-2 ">
                            <div className="flex space-x-2 text-gray-500">
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><Bold className="h-4 w-4 " /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><Italic className="h-4 w-4" /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><Heading1 className="h-4 w-4" /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><Heading2 className="h-4 w-4" /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><Quote className="h-4 w-4" /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><Image className="h-4 w-4" /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
                                <Button className='hover:text-gray-600 hover:bg-gray-200' variant="ghost" size="icon"><ListOrdered className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex space-x-2">
                                <Button onClick={handlePreview} disabled={!isPreviewEnabled || isUploading}>Preview</Button>
                                <Button variant="outline" onClick={onClose} disabled={isUploading}>Close</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col bg-gray-100 p-4 rounded-md h-full">
                        <div className="flex-grow flex justify-center overflow-y-auto thin-scrollbar">
                            <div className="w-full max-w-[794px] min-h-[1123px] bg-white p-8 shadow-md rounded-lg">
                                {previewContent?.text && (
                                    <div className="w-full h-full">
                                        {/* This is where the user's typed text will be rendered */}
                                        <p className="whitespace-pre-wrap text-base leading-relaxed">{previewContent.text}</p>
                                    </div>
                                )}
                                {previewContent?.file && pdfUrl && (
                                    <iframe
                                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                        title="PDF Preview"
                                        className="w-full h-full border-none"
                                        style={{ minHeight: '100%' }}
                                    />
                                )}
                                {previewContent?.file && !pdfUrl && (
                                    <div className="flex flex-col items-center justify-center h-full w-full">
                                        <p className="text-lg font-medium">Loading PDF: {previewContent.file.name}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            If the PDF does not load, your browser might not support inline PDF viewing.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between w-full max-w-[794px] mt-4 self-center bg-gray-100 py-2">
                            <Button variant="ghost" onClick={() => setShowPreview(false)}>Exit preview</Button>
                            <Button onClick={handleSend} className="inline-flex items-center gap-2 rounded-md bg-[#7f56d9] px-4 text-sm text-white hover:bg-[#6941c6]">
                                Send <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Rationale;
