'use client';

import React, { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import api from '@/lib/api';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
});

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    label?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
    const quillRef = useRef<any>(null);

    const imageHandler = useMemo(() => {
        return () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
                const file = input.files?.[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);

                    try {
                        const response = await api.post(
                            '/uploads/image',
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                }
                            }
                        );

                        const url = response.data.url;
                        const quill = quillRef.current?.getEditor();
                        if (quill) {
                            const range = quill.getSelection();
                            quill.insertEmbed(range.index || 0, 'image', url);
                        }
                    } catch (error) {
                        console.error('Image upload failed:', error);
                        alert('Failed to upload image. Please try again.');
                    }
                }
            };
        };
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [imageHandler]);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="rich-text-editor"
                />
            </div>
            <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 1rem !important;
          background: #f9fafb !important;
        }
        .rich-text-editor .ql-container {
          border: none !important;
          min-height: 200px !important;
          font-family: inherit !important;
          font-size: 0.95rem !important;
        }
        .rich-text-editor .ql-editor {
          padding: 1.25rem !important;
          min-height: 200px !important;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          left: 1.25rem !important;
          font-style: normal !important;
          color: #9ca3af !important;
          font-weight: 500 !important;
        }
      `}</style>
        </div>
    );
}
