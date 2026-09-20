"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CheckCircle2, Upload, Info, Image as ImageIcon, Check } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

const ACCEPTED_TYPES = { "image/jpeg": [], "image/png": [], "image/webp": [] };

interface ImageUploadStepProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const VIEWS = [
  { id: "front", label: "Front View", num: 1 },
  { id: "rear", label: "Rear View", num: 2 },
  { id: "side", label: "Side View", num: 3 },
  { id: "interior", label: "Interior View", num: 4 },
];

export default function ImageUploadStep({ files, onFilesChange, onNext, onBack }: ImageUploadStepProps) {
  const [error, setError] = useState<string | null>(null);

  // We maintain an array of exactly 4 items (File or null).
  // If `files` from props has less than 4, we pad it with nulls.
  const slots: (File | null)[] = [null, null, null, null];
  files.forEach((f, i) => {
    if (i < 4) slots[i] = f;
  });

  const uploadedCount = slots.filter((s) => s !== null).length;

  function handleFileDrop(index: number, acceptedFiles: File[]) {
    setError(null);
    if (acceptedFiles.length === 0) return;
    
    const newSlots = [...slots];
    newSlots[index] = acceptedFiles[0]; // Take only the first if they drop multiple
    
    // Convert back to a compact array for the parent store
    const compactFiles = newSlots.filter((f) => f !== null) as File[];
    onFilesChange(compactFiles);
  }

  function removeFile(index: number) {
    const newSlots = [...slots];
    newSlots[index] = null;
    const compactFiles = newSlots.filter((f) => f !== null) as File[];
    onFilesChange(compactFiles);
  }

  const leftFooterGuidelines = (
    <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 mt-6">
      <div className="flex items-center gap-2 text-[#166534] font-semibold mb-3">
        <Info className="w-4 h-4" />
        Image Guidelines
      </div>
      <ul className="space-y-2.5">
        {[
          "Upload clear, well-lit images",
          "Capture from all key angles",
          "Show interior and dashboard",
          "Include any visible damages",
          "JPG, PNG up to 10MB each"
        ].map((rule, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#166534]/80">
            <Check className="w-4 h-4 mt-0.5 text-[#16A34A] flex-shrink-0" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <StepLayout
      stepNumber={10}
      totalSteps={11}
      title="Upload 4 Vehicle Images"
      subtitle="Add clear images of your vehicle"
      description="Our AI will analyze the images to understand your car's condition, detect any damage, and provide you with the most accurate valuation."
      onBack={onBack}
      onNext={onNext}
      nextLabel="Review Details"
      nextDisabled={uploadedCount < 1} // Allow moving forward if at least 1 image is uploaded, or change to 4 if strictly required
      leftFooter={leftFooterGuidelines}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-zinc-900 text-lg">Upload exactly 4 images</h3>
            <p className="text-sm text-zinc-500">JPG, PNG up to 10MB each</p>
          </div>
          <div className={`flex items-center gap-2 text-sm font-semibold
            ${uploadedCount === 4 ? "text-[#16A34A]" : "text-zinc-500"}`}>
            {uploadedCount} / 4 Images Uploaded
            {uploadedCount === 4 && <CheckCircle2 className="w-5 h-5" />}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 flex-grow content-start pb-4">
          {VIEWS.map((view, i) => {
            const file = slots[i];
            const isUploaded = !!file;

            return (
              <SlotDropzone
                key={view.id}
                view={view}
                file={file}
                isUploaded={isUploaded}
                onDrop={(accepted) => handleFileDrop(i, accepted)}
                onRemove={() => removeFile(i)}
                onError={(msg) => setError(msg)}
              />
            );
          })}
        </div>
      </div>
    </StepLayout>
  );
}

function SlotDropzone({ view, file, isUploaded, onDrop, onRemove, onError }: any) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => onError("File rejected. Use JPG/PNG under 10MB."),
  });

  return (
    <div className="flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <div 
        {...(isUploaded ? {} : getRootProps())}
        className={`relative h-48 md:h-56 w-full ${!isUploaded && 'cursor-pointer'} transition-all shrink-0`}
      >
        {!isUploaded && <input {...getInputProps()} />}

        {isUploaded ? (
          <>
            {/* Uploaded Preview */}
            <img 
              src={URL.createObjectURL(file)} 
              alt={view.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-white rounded-full">
              <CheckCircle2 className="w-6 h-6 text-[#16A34A] fill-white" />
            </div>
          </>
        ) : (
          <div className="relative w-full h-full group">
            {/* Virtual Visual Placeholder */}
            <div className="absolute inset-0 bg-zinc-100">
              <img 
                src={`/assets/placeholder-${view.id}.jpg`} 
                alt={`${view.label} example`}
                className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-60 transition-opacity"
                onError={(e) => {
                  // Fallback if they haven't added the images yet
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            {/* Overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-colors
              ${isDragActive ? "bg-emerald-500/20 border-2 border-emerald-400" : "bg-black/5 group-hover:bg-black/20"}
            `}>
              <div className="bg-white/90 backdrop-blur-sm text-zinc-800 px-4 py-2 rounded-xl shadow-sm flex flex-col items-center transform group-hover:scale-105 transition-transform">
                <span className="font-bold text-sm">Upload {view.label}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">Click or drag</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-zinc-800 text-xs font-bold w-6 h-6 rounded-md flex items-center justify-center shadow-sm">
          {view.num}
        </div>
      </div>

      <div className="p-4 flex items-center justify-between bg-white">
        <span className="font-bold text-zinc-900">{view.label}</span>
        {isUploaded && (
          <button 
            onClick={onRemove}
            className="text-xs text-zinc-500 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
          >
            Change
          </button>
        )}
      </div>
    </div>
  );
}
