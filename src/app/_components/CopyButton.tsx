export default function CopyButton({
  text,
  ...props
}: {
  text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="text-decoration-none text-primary rounded-full px-4 py-2 no-underline hover:bg-white/60"
      {...props}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
      }}
    >
      Copy
    </button>
  );
}
