"use client";

import { useState, useEffect, ReactNode, ReactElement } from "react";
import { Note } from "@/lib/types"; // Ensure this type is defined correctly
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface NoteEditorProps {
  note: Note | null; // Note type should be defined in your types
  onUpdate: (note: Note) => void; // Function signature for updating note
}

const CodeBlock = ({
  inline = false,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { inline?: boolean }): ReactElement => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus as any}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle(""); // Clear title if note is null
      setContent(""); // Clear content if note is null
    }
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (note) {
      onUpdate({
        ...note,
        title: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (note) {
      onUpdate({
        ...note,
        content: e.target.value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const downloadMarkdown = () => {
    if (!note) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${title || "untitled"}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select or create a note to start writing
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title"
            className="text-lg font-medium border-none shadow-none focus-visible:ring-0"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadMarkdown}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Download Markdown File
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="edit" className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="edit" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing in Markdown..."
                className="min-h-[calc(100vh-12rem)] resize-none border-none shadow-none focus-visible:ring-0 font-mono"
              />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div
              className="p-4 prose prose-sm dark:prose-invert max-w-none"
              id="markdown-preview"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
