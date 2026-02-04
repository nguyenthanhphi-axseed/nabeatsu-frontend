import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";

interface SettingsModalProps {
  onClose: () => void;
  onSaveSuccess: () => void;
  currentConfig: any;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onSaveSuccess,
  currentConfig,
}) => {
  // State form
  const [formData, setFormData] = useState({
    start_num: 1,
    end_num: 40,
    special_num: 3,
    magic_word: "Omoro",
    aho_text: "",
    aho_image_url: "",
    aho_sound_url: "",
  });

  useEffect(() => {
    if (currentConfig) {
      setFormData({
        start_num: currentConfig.start || 1,
        end_num: currentConfig.end || 40,
        special_num: currentConfig.special_num || 3,
        magic_word: currentConfig.magic_word || "Omoro",
        aho_text: currentConfig.aho_text || "",
        aho_image_url: currentConfig.aho_image_url || "",
        aho_sound_url: currentConfig.aho_sound_url || "",
      });
    }
  }, [currentConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //---------------------upload---------------------//
  // upload file handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Prepare send file
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      // 2. Backend API upload file
      const res = await axios.post(
        "http://localhost:4000/api/upload",
        uploadData,
      );

      // 3. Backend response URL -> save to formData
      const fileUrl = res.data.url;
      console.log("Uploaded:", fileUrl);

      setFormData((prev) => ({
        ...prev,
        [fieldName]: fileUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file!");
    }
  };
  //------------------------------------------------//

  const handleSave = async () => {
    const start = Number(formData.start_num);
    const end = Number(formData.end_num);
    const special = Number(formData.special_num);

    if (start >= end) {
      alert("Start must be lower than End");
      return;
    }
    if (start < 0 || end < 0 || special < 0) {
      alert("Number must >= 0");
      return;
    }
    if (special === 0) {
      alert("Special Number must > 0!");
      return;
    }
    if (!formData.magic_word || formData.magic_word.trim() === "") {
      alert("Magic word is missed!");
      return;
    }

    const max_retry = 5;
    for (let i = 1; i <= max_retry; i++) {
      console.log("Save attempt:", i);
      try {
        await axios.put("http://localhost:4000/api/settings", formData);
        alert("Settings Saved!");
        onSaveSuccess();
        onClose();
        return;
      } catch (error) {
        if (i < max_retry) {
          console.log("Retrying to save settings... Attempt:", i + 1);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          console.error(error);
          alert("Error saving settings!");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 w-[600px] border border-gray-400 p-6 rounded shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-500">Settings</h2>
          <Button label="X" image="/close-btn.png" onClick={onClose} />
        </div>

        <div className="space-y-4 font-sans text-sm">
          {/* Number Range */}
          <div>
            <h3 className="font-bold border-b border-gray-300 mb-2">
              --- Number Range ---
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label>
                Start Number:{" "}
                <input
                  type="number"
                  name="start_num"
                  value={formData.start_num}
                  onChange={handleChange}
                  className="border p-1 w-20 ml-2"
                />
              </label>
              <label>
                End Number:{" "}
                <input
                  type="number"
                  name="end_num"
                  value={formData.end_num}
                  onChange={handleChange}
                  className="border p-1 w-20 ml-2"
                />
              </label>
            </div>
          </div>
          {/* Aho Config */}
          <div>
            <h3 className="font-bold border-b border-gray-300 mb-2">
              --- Aho Config ---
            </h3>
            <div className="space-y-2">
              <label className="block">
                Special Number:{" "}
                <input
                  type="number"
                  name="special_num"
                  value={formData.special_num}
                  onChange={handleChange}
                  className="border p-1 w-20 ml-2"
                />
              </label>
              <label className="block">
                Display Text:{" "}
                <input
                  type="text"
                  name="aho_text"
                  value={formData.aho_text}
                  onChange={handleChange}
                  className="border p-1 w-40 ml-2"
                  placeholder="Aho!"
                />{" "}
                (Optional)
              </label>
              <label className="block">
                Image URL:{" "}
                <input
                  type="text"
                  name="aho_image_url"
                  value={formData.aho_image_url}
                  onChange={handleChange}
                  className="border p-1 w-full mt-1 mb-1"
                  placeholder="http://.../image.png"
                />{" "}
                (Optional)
                {/* File upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "aho_image_url")}
                  className="rounded hover:file:cursor-pointer w-auto text-sm w-24 bg-gray-300 ml-2 hover:bg-gray-400"
                />
              </label>
              <label className="block">
                Sound URL:{" "}
                <input
                  type="text"
                  name="aho_sound_url"
                  value={formData.aho_sound_url}
                  onChange={handleChange}
                  className="border p-1 w-full mt-1 mb-1"
                  placeholder="https://.../sound.mp3"
                />{" "}
                (Optional)
                {/* File upload */}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, "aho_sound_url")}
                  className="rounded hover:file:cursor-pointer w-auto text-sm w-24 bg-gray-300 ml-2 hover:bg-gray-400"
                />
              </label>
            </div>
          </div>
          {/* Ending Word */}
          <div className="mt-4">
            <label className="font-bold">
              Ending Word:{" "}
              <input
                type="text"
                name="magic_word"
                value={formData.magic_word}
                onChange={handleChange}
                className="border p-1 w-40"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button label="キャンセル" onClick={onClose} />
          <Button label="保存" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
