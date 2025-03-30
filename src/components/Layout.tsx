import React from "react";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-nanum">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
