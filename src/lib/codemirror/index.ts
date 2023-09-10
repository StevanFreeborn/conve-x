import { HighlightStyle } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

export const darkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#24272d',
      color: '#d0d9e4',
      height: '100%',
    },
    '.cm-content': {
      caretColor: '#f8f8f0',
    },
    '.cm-content, .cm-gutter': { height: '100%' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#f8f8f0',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '&.cm-focused .cm-selectionBackground .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: '#2f333a',
      },
    '.cm-activeLine': {
      backgroundColor: 'transparent',
    },
    '.cm-gutters': {
      border: 'none',
      backgroundColor: '#24272d',
      color: 'd0d9e4',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
    },
  },
  { dark: true }
);

export const highlightStyle = HighlightStyle.define([
  {
    tag: t.comment,
    color: '#6272a4',
  },
  {
    tag: [t.string, t.special(t.brace)],
    color: '#f1fa8c',
  },
  {
    tag: [t.number, t.self, t.bool, t.null],
    color: '#bd93f9',
  },
  {
    tag: [t.keyword, t.operator],
    color: '#ff79c6',
  },
  {
    tag: [t.definitionKeyword, t.typeName],
    color: '#8be9fd',
  },
  {
    tag: t.definition(t.typeName),
    color: '#f8f8f2',
  },
  {
    tag: [
      t.className,
      t.definition(t.propertyName),
      t.function(t.variableName),
      t.attributeName,
    ],
    color: '#50fa7b',
  },
  {
    tag: [t.heading],
    color: '#50fa7b',
  },
]);
