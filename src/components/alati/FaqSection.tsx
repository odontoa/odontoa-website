"use client";

import { useState } from "react";
const INITIAL_VISIBLE = 4;

type FaqItem = { question: string; answer: string };

export default function FaqSection({ items }: { items: FaqItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_VISIBLE);
  const hasMore = items.length > INITIAL_VISIBLE;

  return (
    <div className="alati-faq">
      <h2 className="alati-faq__title">Često postavljana pitanja</h2>
      {visible.map((item, i) => (
        <details key={i} className="alati-faq__item">
          <summary>{item.question}</summary>
          <p className="alati-faq__item-answer">{item.answer}</p>
        </details>
      ))}
      {hasMore && !expanded && (
        <button
          type="button"
          className="alati-faq__more"
          onClick={() => setExpanded(true)}
        >
          Prikaži još pitanja
        </button>
      )}
    </div>
  );
}
