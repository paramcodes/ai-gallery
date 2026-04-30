import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ChevronLeft, ChevronRight, Image as ImageIcon, Trash2, ExternalLink, Sparkles } from 'lucide-react';

// Types
interface ImageItem {
  id: string;
  url: string;
  publicId: string;
  filename: string;
  timestamp: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CloudinaryListResponse {
  images: ImageItem[];
  error?: string;
}

interface UploadResponse {
  url: string;
  publicId: string;
}

// Cloudinary config from environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'do1l4ta4k';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'wagmi_unsigned';
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || 'wagmi-gallery';
const CLOUDINARY_API_BASE_URL = import.meta.env.VITE_CLOUDINARY_API_BASE_URL || '';

function getFunctionUrl(path: string): string {
  if (!CLOUDINARY_API_BASE_URL) {
    return path;
  }
  return `${CLOUDINARY_API_BASE_URL.replace(/\/$/, '')}${path}`;
}

async function parseJsonResponse<T>(response: Response, endpoint: string): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error(
      `Expected JSON from ${endpoint}, got ${contentType || 'unknown'} (status ${response.status}). Use netlify dev locally or set VITE_CLOUDINARY_API_BASE_URL.`
    );
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Invalid JSON from ${endpoint} (status ${response.status})`);
  }
}

// Toast Component with Framer Motion
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-gradient-to-r from-emerald-500 to-green-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600',
    info: 'bg-gradient-to-r from-rose-500 to-pink-600',
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-8 right-8 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl shadow-black/40 flex items-center gap-4 z-50`}
    >
      <Sparkles className="w-5 h-5" />
      <span className="font-medium">{toast.message}</span>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors ml-2">
        <X size={16} />
      </button>
    </motion.div>
  );
}

// Animated Rainbow Text Component
function RainbowText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.span
        className="relative z-10 font-black tracking-tighter inline-block"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(90deg, #f43f5e, #fb7185, #f97316, #f43f5e, #fb7185, #f97316)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {children}
      </motion.span>
    </div>
  );
}

// Animated Subtitle with flowing colors
function AnimatedSubtitle() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-xl md:text-2xl text-white/80 relative"
    >
      <motion.span
        animate={{
          backgroundPosition: ['200% 50%', '-200% 50%', '200% 50%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(90deg, transparent, #fff, #fb7185, #f97316, #fff, transparent)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        className="font-semibold"
      >
        We Are Gonna Make It
      </motion.span>
    </motion.p>
  );
}

// Animated Background
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-rose-950/20" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -left-1/2 w-full h-full"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

// Glowing Logo Component
function GlowingLogo({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) {
  const dimensions = {
    small: 'w-8 h-8 text-sm',
    normal: 'w-10 h-10 text-base',
    large: 'w-16 h-16 text-2xl',
  };

  return (
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl blur-lg opacity-50"
      />
      <div className={`relative ${dimensions[size]} rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30`}>
        <Sparkles className={`${size === 'large' ? 'w-8 h-8' : 'w-5 h-5'} text-white`} />
      </div>
    </div>
  );
}

// Image Card with Framer Motion
function ImageCard({ image, onClick, onDelete, index }: {
  image: ImageItem;
  onClick: () => void;
  onDelete: () => Promise<void>;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/80 to-black/80 border border-white/5 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="aspect-square overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse" />
          )}
          <motion.img
            src={image.url}
            alt={image.filename}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: loaded ? 1 : 1.2, opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover"
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-rose-500/20 via-transparent to-transparent" />

        {/* Actions - glass morphism style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-md"
        >
          <div className="flex justify-between items-end">
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{image.filename}</p>
              <p className="text-white/50 text-xs mt-1">
                {new Date(image.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); window.open(image.url, '_blank'); }}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white border border-white/10"
              >
                <ExternalLink size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.4)' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-3 rounded-xl bg-red-500/20 backdrop-blur-md transition-colors text-red-400 border border-red-500/20"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Lightbox with Framer Motion
function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: {
  images: ImageItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const image = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-6xl max-h-[90vh] w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute -top-14 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white z-10"
          >
            <X size={24} />
          </motion.button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hidden md:flex items-center justify-center"
              >
                <ChevronLeft size={32} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hidden md:flex items-center justify-center"
              >
                <ChevronRight size={32} />
              </motion.button>
            </>
          )}

          {/* Image with glow */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black shadow-2xl shadow-rose-500/20 border border-white/10">
            <motion.img
              key={image.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={image.url}
              alt={image.filename}
              className="max-h-[80vh] w-auto mx-auto object-contain"
            />

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white font-bold text-xl">{image.filename}</p>
              <p className="text-white/50 text-sm mt-2">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>

          {/* Mobile Navigation */}
          {images.length > 1 && (
            <div className="flex justify-center gap-4 mt-6 md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white"
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Upload function using Cloudinary unsigned upload
async function uploadToCloudinary(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', CLOUDINARY_FOLDER);

  console.log('Uploading to Cloudinary:', {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    folder: CLOUDINARY_FOLDER,
  });

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary error:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }

    console.log('Upload successful:', data.secure_url);
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

async function fetchCloudinaryImages(): Promise<ImageItem[]> {
  const endpoint = getFunctionUrl('/.netlify/functions/cloudinary-images');
  const response = await fetch(endpoint);
  const data = await parseJsonResponse<CloudinaryListResponse>(response, endpoint);

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch images from Cloudinary');
  }

  return data.images;
}

async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const endpoint = getFunctionUrl('/.netlify/functions/cloudinary-delete');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  const data = await parseJsonResponse<{ error?: string }>(response, endpoint);

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete image');
  }
}

// Main App
export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const refreshImagesFromCloudinary = async () => {
    const cloudinaryImages = await fetchCloudinaryImages();
    setImages(cloudinaryImages);
    localStorage.setItem('wagmi-gallery', JSON.stringify(cloudinaryImages));
  };

  // Load from Cloudinary (shared), fallback to localStorage if function/env is not configured
  useEffect(() => {
    const loadImages = async () => {
      try {
        await refreshImagesFromCloudinary();
      } catch (error) {
        console.warn('Cloudinary list API unavailable, using localStorage fallback:', error);
        const stored = localStorage.getItem('wagmi-gallery');
        if (stored) {
          try {
            setImages(JSON.parse(stored));
          } catch {
            console.error('Failed to parse stored images');
          }
        }
      }
    };

    loadImages();
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem('wagmi-gallery', JSON.stringify(images));
    }
  }, [images]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    let uploadedAny = false;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        addToast(`${file.name} is not an image`, 'error');
        continue;
      }

      try {
        const uploadResult = await uploadToCloudinary(file);
        const newImage: ImageItem = {
          id: uploadResult.publicId,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          filename: file.name,
          timestamp: Date.now(),
        };
        uploadedAny = true;
        setImages(prev => [newImage, ...prev]);
        addToast(`${file.name} uploaded`, 'success');
      } catch (error) {
        addToast(`Failed to upload ${file.name}`, 'error');
      }
    }

    if (uploadedAny) {
      try {
        await refreshImagesFromCloudinary();
      } catch (error) {
        console.warn('Cloudinary sync after upload failed:', error);
      }
    }

    setIsUploading(false);
  };

  const handleDelete = async (image: ImageItem) => {
    if (!image.publicId) {
      setImages(prev => prev.filter(img => img.id !== image.id));
      addToast('Image deleted locally', 'info');
      return;
    }

    try {
      await deleteCloudinaryImage(image.publicId);
      await refreshImagesFromCloudinary();
      addToast('Image deleted', 'info');
    } catch (error) {
      console.error('Delete error:', error);
      addToast('Failed to delete image', 'error');
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Header - Centered */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="sticky top-0 z-40 backdrop-blur-2xl bg-black/40 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left side - Upload button (moved from center) */}
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 cursor-pointer font-bold shadow-lg shadow-rose-500/30 transition-shadow hover:shadow-rose-500/50"
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
            <Upload className="w-4 h-4" />
            <span className="text-sm">UPLOAD</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
          </motion.label>

          {/* Center - WAGMI Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <GlowingLogo size="normal" />
            <RainbowText className="text-2xl font-black tracking-tighter">
              WAGMI
            </RainbowText>
          </motion.div>

          {/* Right side - Counter */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
          >
            <ImageIcon className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-medium text-white/80">{images.length}</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          {/* Big Animated WAGMI */}
          <div className="mb-6">
            <RainbowText className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
              WAGMI
            </RainbowText>
          </div>

          {/* Animated Subtitle */}
          <AnimatedSubtitle />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/40 mt-4"
          >
            Upload & Display Your Collection
          </motion.p>

          {/* Upload Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(244, 63, 94, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => inputRef.current?.click()}
            className="mt-12 relative px-12 py-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white font-bold text-xl shadow-2xl shadow-rose-500/40 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-4">
              <Upload size={28} />
              Choose Files
            </span>
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
            />
          </motion.button>

          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex items-center justify-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full"
              />
              <span className="text-white/60">Uploading...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Gallery Grid */}
        {images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={() => setSelectedIndex(index)}
                onDelete={() => handleDelete(image)}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-red-500/20 rounded-full blur-3xl" />
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                <ImageIcon className="w-14 h-14 text-white/30" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-white/80 mb-2">No images yet</h3>
            <p className="text-white/40">Upload your first image to start</p>
          </motion.div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onNext={() => setSelectedIndex((selectedIndex + 1) % images.length)}
            onPrev={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}
          />
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}