"use client";

import Editor from "@monaco-editor/react";

const LANGUAGE_MAP = {
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
};

export default function CodeEditor({
  value,
  onChange,
  language = "JavaScript",
  readOnly = false,
}) {
  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue || "");
    }
  };

  const handleEditorMount = (editor, monaco) => {
    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      padding: { top: 16, bottom: 16 },
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    });
  };

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-700">
      <Editor
        height="100%"
        language={LANGUAGE_MAP[language] || "javascript"}
        value={value || ""}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
