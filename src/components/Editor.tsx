'use client';

import { useCodeMirror } from '@/hooks';
import { darkTheme } from '@/lib/codemirror';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function Editor() {
  const { theme } = useTheme();
  const editorTheme = new Compartment();
  const [currentDoc, setCurrentDoc] = useState('');

  const doc = [''];
  const extensions = [
    basicSetup,
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorState.tabSize.of(2),
    editorTheme.of([]),
    keymap.of([indentWithTab]),
    EditorView.updateListener.of(vu => {
      setCurrentDoc(vu.state.doc.toString());
    }),
  ];

  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const { editorRef, editorView } = useCodeMirror({ doc, extensions });

  useEffect(() => {
    if (editorView === null) {
      return;
    }

    if (theme === 'dark') {
      editorView.dispatch({
        effects: editorTheme.reconfigure([darkTheme]),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, editorView]);

  return (
    <form className='flex flex-col shadow-md rounded-md dark:bg-secondary-gray border border-gray-600'>
      <div className='flex items-center justify-between rounded-t-md p-4 pb-0 border-b border-gray-600 dark:bg-primary-gray'>
        <div className='flex items-center'>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:dark:bg-secondary-gray disabled:border disabled:border-gray-600 disabled:border-b-0'
            disabled={mode === 'write'}
            onClick={() => setMode('write')}
            type='button'
          >
            Write
          </button>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md disabled:dark:bg-secondary-gray disabled:border disabled:border-gray-600 disabled:border-b-0'
            disabled={mode === 'preview'}
            onClick={() => setMode('preview')}
            type='button'
          >
            Preview
          </button>
        </div>
        <div></div>
      </div>
      <div className='p-4'>
        <div
          className={`${mode === 'write' ? '' : 'hidden'}`}
          ref={editorRef}
        ></div>
        <ReactMarkdown
          className={`${mode === 'preview' ? '' : 'hidden'}`}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  style={oneDark}
                  language={match[1]}
                  PreTag='div'
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code
                  {...props}
                  className={className}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {currentDoc}
        </ReactMarkdown>
      </div>
      <div className='flex items-center justify-end'>
        <button type='submit'>Post</button>
      </div>
    </form>
  );
}
