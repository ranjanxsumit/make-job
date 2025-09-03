import Layout from "@/components/layout/Layout";

export default function Placeholder({ title }: { title: string }) {
  return (
    <Layout>
      <div className="h-[50vh] grid place-items-center text-center text-gray-600">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          <p>This page is a placeholder. Continue prompting to fill in real content.</p>
        </div>
      </div>
    </Layout>
  );
}
