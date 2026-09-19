export interface Modal {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AlertModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  desc?: string;
  variant?: 'cms' | 'public';
}

export interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCrop: (croppedFile: File) => void;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
  customFileName?: string;
}

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string | null;
  images?: string[];
  title?: string;
  aspectRatio?: 'video' | '3/2' | '1/1' | '16/9';
}
