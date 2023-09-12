'use client';

import { useCodeMirror, useRouter } from '@/hooks';
import { basicDark } from '@/lib/codemirror';
import { useUser } from '@clerk/nextjs';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Compartment, EditorState, Text } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useMutation } from 'convex/react';
import { FormEvent, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import PostContent from './PostContent';

export default function Editor({ post }: { post?: Doc<'posts'> }) {
  const { user, isSignedIn } = useUser();
  const editorTheme = new Compartment();
  const [currentDoc, setCurrentDoc] = useState(post?.content ?? ['']);
  const createOrUpdatePost = useMutation(api.posts.createOrUpdatePost);
  const router = useRouter();
  const [creatingOrUpdating, setCreatingOrUpdating] = useState(false);

  const extensions = [
    basicSetup,
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorState.tabSize.of(2),
    editorTheme.of(basicDark),
    keymap.of([indentWithTab]),
    EditorView.updateListener.of(vu => {
      setCurrentDoc(vu.state.doc.toJSON());
    }),
  ];

  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const { editorRef } = useCodeMirror({ doc: currentDoc, extensions });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (isSignedIn !== true) {
        router.push('/login');
        return;
      }

      setCreatingOrUpdating(true);

      const result = await createOrUpdatePost({
        id: post?._id,
        clerkUserId: user.id,
        content: currentDoc,
      });

      switch (result) {
        case 'USER_NOT_FOUND':
        case 'USER_NOT_AUTHORIZED':
        case 'CANNOT_POST_ON_BEHALF_OF_ANOTHER_USER':
          throw Error('Unable to create post');
        default:
          router.push('/');
          return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingOrUpdating(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col flex-1 shadow-md rounded-md dark:bg-secondary-gray border border-gray-600'
    >
      <div className='flex items-center justify-between rounded-t-md p-4 pb-0 border-b border-gray-600 dark:bg-primary-gray'>
        <div className='flex items-center'>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:bg-white disabled:border disabled:border-b-0 disabled:border-gray-600 disabled:dark:bg-secondary-gray'
            disabled={mode === 'write'}
            onClick={() => setMode('write')}
            type='button'
          >
            Write
          </button>
          <button
            className='flex items-center justify-center px-3 py-2 rounded-t-md -mb-[1px] disabled:bg-white disabled:border disabled:border-b-0 disabled:border-gray-600 disabled:dark:bg-secondary-gray'
            disabled={mode === 'preview'}
            onClick={() => setMode('preview')}
            type='button'
          >
            Preview
          </button>
        </div>
        <div></div>
      </div>
      <div className='flex flex-col p-4 h-0 flex-grow'>
        <div
          className={`${mode === 'write' ? '' : 'hidden'} flex-1 overflow-auto`}
          ref={editorRef}
        ></div>
        <div
          className={`${
            mode === 'preview' ? '' : 'hidden'
          } flex-1 overflow-auto`}
        >
          <PostContent content={Text.of(currentDoc).toString()} />
        </div>
      </div>
      <div className='flex items-center justify-end p-4 pt-0 gap-4'>
        <button
          onClick={() => router.back()}
          type='button'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={
            !currentDoc.join() ||
            !currentDoc.join().trim() ||
            creatingOrUpdating
          }
          className='py-1 px-4 bg-primary-accent text-white rounded-md disabled:opacity-50 flex items-center justify-center gap-2'
        >
          Post
        </button>
      </div>
    </form>
  );
}
