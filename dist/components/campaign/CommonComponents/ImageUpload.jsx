import React, { useRef } from "react";
import Image from "next/image";
import EditPencilIcon from "@/components/Icons/IconsBuilder/EditPencilIcon";
import RemoveImageIcon from "@/components/Icons/IconsBuilder/RemoveImageIcon";
var ImageUpload = function (_a) {
    var imageUrl = _a.imageUrl, onImageChange = _a.onImageChange, onRemoveImage = _a.onRemoveImage;
    var fileInputRef = useRef(null);
    var handleFileChange = function (e) {
        var file = e.target.files ? e.target.files[0] : null;
        onImageChange(file);
        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    var handleRemoveImage = function () {
        onRemoveImage();
        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    return (<div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[173px] relative overflow-hidden gap-1 pt-4 pb-4 rounded-lg bg-gray-800 border-[0.5px] border-black/30">
      {imageUrl ? (<div className="absolute inset-0 flex justify-center items-center">
          <Image src={imageUrl} alt="Uploaded" layout="fill" objectFit="cover" className="opacity-80"/>
        </div>) : (<div className="absolute top-6 text-gray-100 text-sm">
          No image uploaded
        </div>)}
      <div className="absolute inset-0 flex justify-center items-center">
        <label className="flex flex-col items-center cursor-pointer">
          <EditPencilIcon />
          <p className="text-xs text-white">Edit</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef}/>
        </label>
        {imageUrl && (<div className="flex flex-col items-center ml-4 cursor-pointer" onClick={handleRemoveImage}>
            <RemoveImageIcon />
            <p className="text-xs text-white">Remove</p>
          </div>)}
      </div>
    </div>);
};
export default ImageUpload;
