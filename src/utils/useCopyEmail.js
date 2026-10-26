import { useState, useCallback, useRef, useEffect } from "react";
import { CONTACT } from "../data/nav.js";

export function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const copy = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const emailToCopy = CONTACT.email || "nikbobbary@gmail.com";
    let success = false;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        success = true;
      } catch {
        // Fall back to execCommand if clipboard API is denied or document is not focused
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = emailToCopy;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
    }

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copy };
}
