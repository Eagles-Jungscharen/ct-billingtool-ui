import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { makeStyles, tokens, Button, Divider } from '@fluentui/react-components';
import {
  TextBoldRegular,
  TextItalicRegular,
  TextBulletListRegular,
  TextNumberListLtrRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  wrapper: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  wrapperFocused: {
    border: `1px solid ${tokens.colorBrandStroke1}`,
    outlineStyle: 'solid',
    outlineWidth: '1px',
    outlineColor: tokens.colorBrandStroke1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '4px 6px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexWrap: 'wrap',
  },
  editorContent: {
    padding: '8px 12px',
    minHeight: '80px',
    '& .tiptap': {
      outline: 'none',
      fontSize: tokens.fontSizeBase300,
      lineHeight: tokens.lineHeightBase300,
      color: tokens.colorNeutralForeground1,
    },
    '& .tiptap p': {
      margin: '0 0 4px 0',
    },
    '& .tiptap ul, & .tiptap ol': {
      paddingLeft: '20px',
      margin: '0 0 4px 0',
    },
    '& .tiptap p.is-editor-empty:first-child::before': {
      content: 'attr(data-placeholder)',
      color: tokens.colorNeutralForeground4,
      pointerEvents: 'none',
      float: 'left',
      height: '0',
    },
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FunctionComponent<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Beschreibung eingeben…',
}) => {
  const styles = useStyles();
  const [focused, setFocused] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. when loading existing invoice)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // Normalize empty states: treat '<p></p>' as empty
    const isEmpty = current === '<p></p>' || current === '';
    const valueIsEmpty = value === '<p></p>' || value === '' || value == null;
    if (isEmpty && valueIsEmpty) return;
    if (current !== value) {
      editor.commands.setContent(value ?? '');
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    active,
    onClick,
    icon,
    title,
  }: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactElement;
    title: string;
  }) => (
    <Button
      appearance={active ? 'primary' : 'subtle'}
      size="small"
      icon={icon}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    />
  );

  return (
    <div
      className={`${styles.wrapper}${focused ? ` ${styles.wrapperFocused}` : ''}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className={styles.toolbar}>
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<TextBoldRegular />}
          title="Fett"
        />
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<TextItalicRegular />}
          title="Kursiv"
        />
        <Divider vertical style={{ height: '20px', margin: '0 4px' }} />
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<TextBulletListRegular />}
          title="Aufzählung"
        />
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<TextNumberListLtrRegular />}
          title="Nummerierte Liste"
        />
      </div>
      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
