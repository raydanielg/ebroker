"use client";
import React from "react";

const RichTextContent = ({ content }) => {
  return (
    <div className="rich-text-content">
      <div
        dangerouslySetInnerHTML={{
          __html: content || "",
        }}
      />
    </div>
  );
};

export default RichTextContent;
