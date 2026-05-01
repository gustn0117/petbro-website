"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

export default function PopupImageField({
  defaultValue,
}: {
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue || "");

  return (
    <>
      <input type="hidden" name="image_url" value={url} />
      <ImageUploader
        value={url ? [url] : []}
        onChange={(next) => setUrl(next[0] || "")}
        layout="grid"
        multiple={false}
        emptyHint="팝업 상단에 표시될 이미지를 업로드하세요. (선택)"
        hint="JPG · PNG · WebP · GIF · 최대 5MB · 가로형 이미지 추천"
      />
    </>
  );
}
