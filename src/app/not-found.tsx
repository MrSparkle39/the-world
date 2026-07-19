import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-md rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.95)] p-6 text-center shadow">
        <h1 className="font-display text-3xl text-[var(--title)]">Path misplaced</h1>
        <p className="mt-3 text-[var(--ink-soft)]">
          This path does not appear to lead anywhere today.
        </p>
        <Link href="/map" className="btn-primary mt-5 inline-block">
          Return to the map
        </Link>
      </div>
    </main>
  );
}
