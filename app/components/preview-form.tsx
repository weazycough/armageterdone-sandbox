// preview-form.tsx — a form that looks real but sends nothing: this is a
// preview site with no backend. The inputs carry no `name`, so even a submit
// before the page's script loads puts nothing in the URL; after it loads,
// submitting shows a notice instead.

import { useState } from "react";
import type * as React from "react";
import { Form } from "react-aria-components";

export function PreviewForm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactNode {
  const [tried, setTried] = useState(false);
  return (
    <>
      <Form
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
        }}
      >
        {children}
      </Form>
      <p className="preview-note" role="status">
        {tried
          ? "Preview only: nothing was sent. Forms go live with the real site."
          : "Preview only: this form doesn't send anything yet."}
      </p>
    </>
  );
}
