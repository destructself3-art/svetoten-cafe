"use client";

import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { usePageTransition } from "./TransitionProvider";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** A normal Next link that plays the steam transition between pages. */
export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, target, children, ...rest },
  ref,
) {
  const { navigate } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || target === "_blank") return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link ref={ref} href={href} target={target} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
});
