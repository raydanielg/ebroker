"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDropzone } from 'react-dropzone';
import { useTranslation } from '../context/TranslationContext';
import toast from 'react-hot-toast';
import { uploadBankReceiptFileApi, uploadReceiptApi } from '@/api/apiRoutes';
import { X, Upload } from 'lucide-react';

const UploadFileReceiptModal = ({ open, onClose, transaction, onSuccess }) => {
  const t = useTranslation();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setFile(null);
      setIsUploading(false);
    }
  }, [open]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5242880, // 5MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error(t("fileTooLarge"));
      } else if (error?.code === 'file-invalid-type') {
        toast.error(t("invalidFileType"));
      } else {
        toast.error(t("fileUploadFailed"));
      }
    }
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) {
      toast.error(t("pleaseSelectFile"));
      return;
    }

    if (!transaction?.id) {
      toast.error(t("transactionInfoMissing"));
      return;
    }

    setIsUploading(true);

    try {
     
      const response = await uploadBankReceiptFileApi({
        file: file,
        payment_transaction_id: transaction.id
      });
      
      if (response.error === false) {
        toast.success(t("receiptUploadedSuccessfully"));
        onClose();
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        toast.error(response.message || t("receiptUploadFailed"));
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast.error(t("receiptUploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("uploadReceipt")}
          </DialogTitle>
        </DialogHeader>

        {/* Dropzone */}
        <div className="py-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="primaryBg rounded-full p-2 text-white">
                  <Upload size={20} />
                </div>
                <p className="font-medium break-all">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" /> {t("remove")}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-100 rounded-full p-3">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <p className="font-medium">{t("dragAndDropFile")}</p>
                <p className="text-sm text-gray-500">{t("or")}</p>
                <p className="text-sm primaryColor font-medium">
                  {t("browseFiles")}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {t("maxFileSize")} 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="primaryBg text-white"
          >
            {isUploading ? t("uploading") : t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileReceiptModal;
