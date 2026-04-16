"use client";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
  mainClassName?: string;
}

export default function PageWrapper({
  children,
  className = "",
  withPadding = true,
  mainClassName = "",
}: PageWrapperProps) {
  return (
    <div className={`flex flex-1 overflow-hidden ${className}`}>
      <main
        className={`flex-1 overflow-auto ${withPadding ? "p-4 sm:p-8" : ""} ${mainClassName}`}
      >
        {children}
      </main>
    </div>
  );
}
