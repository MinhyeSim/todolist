import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="font-nanum">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
