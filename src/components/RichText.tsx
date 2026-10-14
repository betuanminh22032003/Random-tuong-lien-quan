import Link from 'next/link';
import { Fragment } from 'react';

interface RichTextProps {
  text: string;
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders plain text with [label](/path) inline links. */
export default function RichText({ text }: RichTextProps) {
  const parts: Array<string | { label: string; href: string }> = [];
  let last = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push({ label: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <Link key={i} href={part.href}>
            {part.label}
          </Link>
        )
      )}
    </>
  );
}
