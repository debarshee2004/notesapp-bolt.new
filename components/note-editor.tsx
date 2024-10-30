"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/types";
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
// import dynamic from 'next/dynamic';

// const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (note: Note) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
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

  // const downloadPDF = () => {
  //   if (!note) return;
  //   const element = document.getElementById('markdown-preview');
  //   if (!element || !html2pdf) return;

  //   const opt = {
  //     margin: 1,
  //     filename: `${title || 'untitled'}.pdf`,
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  //   };

  //   html2pdf().set(opt).from(element).save();
  // };

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
            {/* <Button
              variant="outline"
              size="sm"
              onClick={downloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button> */}
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
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
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
                  },
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
