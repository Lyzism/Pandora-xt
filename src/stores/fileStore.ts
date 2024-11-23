import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileState {
  uploadedFile: File | null;
  previewedFile: File | null;
  uploadedFilePreview?: string | null;
  previewedFilePreview?: string | null;
  setUploadedFile: (file: File | null) => void;
  setPreviewedFile: (file: File | null) => void;
  setUploadedFilePreview: (preview: string | null) => void;
  setPreviewedFilePreview: (preview: string | null) => void;
  clearUploadedFile: () => void;
  clearPreviewedFile: () => void;
}

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      uploadedFile: null,
      previewedFile: null,
      uploadedFilePreview: null,
      previewedFilePreview: null,
      
      setUploadedFile: (file) => set({ uploadedFile: file }),
      setPreviewedFile: (file) => set({ previewedFile: file }),
      
      setUploadedFilePreview: (preview) => set({ uploadedFilePreview: preview }),
      setPreviewedFilePreview: (preview) => set({ previewedFilePreview: preview }),
      
      clearUploadedFile: () => set({ uploadedFile: null, uploadedFilePreview: null }),
      clearPreviewedFile: () => set({ previewedFile: null, previewedFilePreview: null }),
    }),
    {
      name: 'file-storage',
      partialize: (state) => ({
        uploadedFile: state.uploadedFile,
        previewedFile: state.previewedFile,
        uploadedFilePreview: state.uploadedFilePreview,
        previewedFilePreview: state.previewedFilePreview
      })
    }
  )
);
