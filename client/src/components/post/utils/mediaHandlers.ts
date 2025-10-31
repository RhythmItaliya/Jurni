import { Dispatch, SetStateAction } from 'react';

export interface MediaHandlerProps {
  selectedFiles: File[];
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
  previews: string[];
  setPreviews: Dispatch<SetStateAction<string[]>>;
  currentPreviewIndex: number;
  setCurrentPreviewIndex: Dispatch<SetStateAction<number>>;
  isPreviewMode: boolean;
  setIsPreviewMode: Dispatch<SetStateAction<boolean>>;
  isDragOver: boolean;
  setIsDragOver: Dispatch<SetStateAction<boolean>>;
}

export const generatePreview = (file: File): Promise<string> => {
  return new Promise(resolve => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      // For videos, we'll use a placeholder or try to get thumbnail
      resolve('/video-placeholder.png'); // You can add a video icon image
    } else {
      resolve('/file-placeholder.png'); // Fallback
    }
  });
};

export const updatePreviews = async (
  files: File[],
  setPreviews: Dispatch<SetStateAction<string[]>>
) => {
  const newPreviews = await Promise.all(files.map(generatePreview));
  setPreviews(newPreviews);
};

export const handleDragOver = (
  e: React.DragEvent,
  setIsDragOver: Dispatch<SetStateAction<boolean>>
) => {
  e.preventDefault();
  setIsDragOver(true);
};

export const handleDragLeave = (
  e: React.DragEvent,
  setIsDragOver: Dispatch<SetStateAction<boolean>>
) => {
  e.preventDefault();
  setIsDragOver(false);
};

export const handleDrop = async (
  e: React.DragEvent,
  selectedFiles: File[],
  setSelectedFiles: Dispatch<SetStateAction<File[]>>,
  setPreviews: Dispatch<SetStateAction<string[]>>,
  setIsDragOver: Dispatch<SetStateAction<boolean>>
) => {
  e.preventDefault();
  setIsDragOver(false);

  const files = Array.from(e.dataTransfer.files);
  const validFiles = files.filter(
    file => file.type.startsWith('image/') || file.type.startsWith('video/')
  );

  if (validFiles.length > 0) {
    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    await updatePreviews(newFiles, setPreviews);
  }
};

export const handleFileSelect = async (
  e: React.ChangeEvent<HTMLInputElement>,
  selectedFiles: File[],
  setSelectedFiles: Dispatch<SetStateAction<File[]>>,
  setPreviews: Dispatch<SetStateAction<string[]>>
) => {
  const files = Array.from(e.target.files || []);
  const validFiles = files.filter(
    file => file.type.startsWith('image/') || file.type.startsWith('video/')
  );

  if (validFiles.length > 0) {
    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    await updatePreviews(newFiles, setPreviews);
  }
};

export const removeFile = (
  index: number,
  selectedFiles: File[],
  setSelectedFiles: Dispatch<SetStateAction<File[]>>,
  previews: string[],
  setPreviews: Dispatch<SetStateAction<string[]>>,
  currentPreviewIndex: number,
  setCurrentPreviewIndex: Dispatch<SetStateAction<number>>,
  setIsPreviewMode: Dispatch<SetStateAction<boolean>>
) => {
  const newFiles = selectedFiles.filter((_, i) => i !== index);
  const newPreviews = previews.filter((_, i) => i !== index);
  setSelectedFiles(newFiles);
  setPreviews(newPreviews);

  // Adjust current index if necessary
  if (currentPreviewIndex >= newFiles.length && newFiles.length > 0) {
    setCurrentPreviewIndex(newFiles.length - 1);
  } else if (newFiles.length === 0) {
    setCurrentPreviewIndex(0);
    setIsPreviewMode(false);
  }
};

export const nextPreview = (
  selectedFiles: File[],
  setCurrentPreviewIndex: Dispatch<SetStateAction<number>>
) => {
  setCurrentPreviewIndex(prev =>
    prev === selectedFiles.length - 1 ? 0 : prev + 1
  );
};

export const prevPreview = (
  selectedFiles: File[],
  setCurrentPreviewIndex: Dispatch<SetStateAction<number>>
) => {
  setCurrentPreviewIndex(prev =>
    prev === 0 ? selectedFiles.length - 1 : prev - 1
  );
};

export const goToPreview = (
  index: number,
  setCurrentPreviewIndex: Dispatch<SetStateAction<number>>,
  setIsPreviewMode: Dispatch<SetStateAction<boolean>>
) => {
  setCurrentPreviewIndex(index);
  setIsPreviewMode(true);
};

export const exitPreview = (
  setIsPreviewMode: Dispatch<SetStateAction<boolean>>
) => {
  setIsPreviewMode(false);
};
