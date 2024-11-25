import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileState {
  uploadedFile: File | null;
  previewedFile: File | null;
  uploadedFilePreview?: string | null;
  previewedFilePreview?: string | null;
  isFileInvalid: boolean; 
  setUploadedFile: (file: File | null) => void;
  setPreviewedFile: (file: File | null) => void;
  setUploadedFilePreview: (preview: string | null) => void;
  setPreviewedFilePreview: (preview: string | null) => void;
  setFileInvalid: (invalid: boolean) => void; 
  clearUploadedFile: () => void;
  clearPreviewedFile: () => void;
  resetState: () => void;
}

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      uploadedFile: null,
      previewedFile: null,
      uploadedFilePreview: null,
      previewedFilePreview: null,
      isFileInvalid: false,

      setUploadedFile: (file) => set({ uploadedFile: file }),
      setPreviewedFile: (file) => set({ previewedFile: file }),
      setUploadedFilePreview: (preview) => set({ uploadedFilePreview: preview }),
      setPreviewedFilePreview: (preview) => set({ previewedFilePreview: preview }),

      setFileInvalid: (invalid) => set({ isFileInvalid: invalid }),

      clearUploadedFile: () =>
        set({ uploadedFile: null, uploadedFilePreview: null, isFileInvalid: false }),
      clearPreviewedFile: () =>
        set({ previewedFile: null, previewedFilePreview: null }),

      resetState: () =>
        set({
          uploadedFile: null,
          previewedFile: null,
          uploadedFilePreview: null,
          previewedFilePreview: null,
          isFileInvalid: false,
        }),
    }),
    {
      name: 'file-storage',
      partialize: (state) => ({
        uploadedFile: state.uploadedFile,
        previewedFile: state.previewedFile,
        uploadedFilePreview: state.uploadedFilePreview,
        previewedFilePreview: state.previewedFilePreview,
        isFileInvalid: state.isFileInvalid,
      }),
    }
  )
);