import { Header } from "./Header";

export default function Layout({ children, fullWidthSlot }: { children: React.ReactNode; fullWidthSlot?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbfbff]">
      <Header />
      {fullWidthSlot && (
        <div className="w-full bg-white shadow-[0_0_14px_rgba(197,191,191,0.25)] ring-1 ring-[#EAEAEA]">
          <div className="container mx-auto px-4 py-4">{fullWidthSlot}</div>
        </div>
      )}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
