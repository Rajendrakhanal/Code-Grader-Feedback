import React, { useEffect, useState } from "react";
import Editor, { OnChange, Monaco } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";

interface CodeEditorWindowProps {
  onChange: (action: string, data: string) => void;
  language: string;
  code: string;
}

const CodeEditorWindow: React.FC<CodeEditorWindowProps> = ({
  onChange,
  language,
  code,
}) => {
  const [value, setValue] = useState<string>(code || "");

  const handleEditorChange: OnChange = (value: string | undefined) => {
    setValue(value || "");
    onChange("code", value || "");
  };

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    // Define the keybinding for Ctrl + P to trigger the command palette
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
      editor.trigger("", "editor.action.quickCommand", null);
    });
  };

  // Inject custom styles to increase the size of the command palette
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
          .monaco-menu {
            font-size: 24px !important; /* Increase font size */
            max-height: 500px !important; /* Increase height */
            width: 500px !important; /* Increase width */
          }
          .monaco-menu .monaco-action-bar .action-label {
            font-size: 16px !important; /* Font size for action items */
          }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl"
      style={{
        border: "2px solid white", // Add white border
        borderRadius: "5px", // Optional: rounded corners for the border
      }}
    >
      <Editor
        height="75vh"
        width="100%"
        language={language || "c"}
        value={value}
        theme="vs-dark"
        defaultValue="// Start writing your code"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 18, // Readable font size
          minimap: { enabled: false }, // Useful for code navigation
          wordWrap: "on", // Improves readability for long lines
          lineNumbers: "on", // Always helpful to display line numbers
          smoothScrolling: true, // Better scrolling experience
          scrollBeyondLastLine: false, // Avoid extra space at the end
          automaticLayout: true, // Dynamically adjust to container size
          tabSize: 2, // Compact tab size for better structure
          cursorSmoothCaretAnimation: "on", // Better cursor visibility
          formatOnPaste: true, // Automatically formats code when pasted
          formatOnType: true, // Auto format code while typing
          folding: true, // Allows collapsing code blocks for readability
          autoIndent: "full", // Ensures proper indentation for code blocks
          quickSuggestions: true, // Enable code suggestions
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
