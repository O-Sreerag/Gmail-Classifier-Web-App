import React from 'react';

// Function to decode Base64 string
const decodeBase64 = (base64: string) => {
  // Replace URL-safe characters
  let base64String = base64.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if necessary
  const padding = base64String.length % 4;
  if (padding > 0) {
    base64String += '='.repeat(4 - padding);
  }

  // Decode Base64 string
  return atob(base64String);
};

// Function to download file
const downloadFile = (filename: any, mimeType: any, base64Data: any) => {
  try {
    // Decode Base64 string to binary data
    const binaryString = decodeBase64(base64Data);
    const byteNumbers = new Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteNumbers[i] = binaryString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob object
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

// React component for file download
const FileDownloader = () => {
  // Example file data
  const fileData = {
    filename: '1724413185548.png',
    mimeType: 'image/png',
    data: 'ANGjdJ_OoNsUZCiUp4Vx30ToR6slUhbXHRz4keiui9bgBBRqWgChUKj0sLem5ZjwbTcctJMk35Y5Ahx0GcfRIVpGhCjoUu7NohhHMljvGVVnELcd64_vnwYC9N_gZeLSRBy7iwalUxPVmRhAK3TmQExlcpsSkHPe1DhCo0Oj5TNTbxTbDINMSN-3IyjeA3jjbradeRpQY6dWfbBtvaeWOWDq-ufIrX5QOVrASalKioEGRdo-SzsAN8kbHXEPeQGIsBMYCW05hCRfMMjOQuqQX-9vgMvv67Su_n46_qLtcCf5Iyhu7pHDglRIkx2DMx8cIEYPFM9w9HHG3HUiqyq6QGnDRdYW9KBD3UNXnLvxV26q33GKSohOREGuNj8Qk15qVJwF6i_5pj3axWgcybGE'
  };

  const handleDownload = () => {
    downloadFile(fileData.filename, fileData.mimeType, fileData.data);
  };

  return (
    <div>
      <button onClick={handleDownload}>Download File</button>
    </div>
  );
};

export default FileDownloader;

// Here's an example of how to decode an email attachment using the Gmail API in Node.js: