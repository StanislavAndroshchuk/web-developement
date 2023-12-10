import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const acceptedFileTypes = 'text/plain';

const Dropzone = ({ onFileDrop }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Перевірте, чи файл є TXT і обробіть його
    if (acceptedFiles.length === 1 && acceptedFiles[0].type === acceptedFileTypes) {
      onFileDrop(acceptedFiles[0]);
    } else {
      alert('Будь ласка, завантажте лише один файл TXT.');
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false, // Забороняємо вибір кількох файлів
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Перетягніть сюди файл TXT або клацніть, щоб вибрати файл.</p>
    </div>
  );
};

export default Dropzone;