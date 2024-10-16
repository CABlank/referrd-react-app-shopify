import React from "react";
import QRCode from "qrcode.react";

interface QRPopupProps {
  campaignId: number;
  qrValue: string;
  onClose: () => void;
  onDownload: (campaignId: number) => void;
}

const QRPopup: React.FC<QRPopupProps> = ({ campaignId, qrValue, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg z-60 flex flex-col items-center">
        <QRCode id={`qr-${campaignId}`} value={qrValue} />
        <div className="flex justify-end mt-4 w-full">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(campaignId)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPopup;
