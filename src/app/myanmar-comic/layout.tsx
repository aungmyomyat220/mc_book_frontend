// import Analytics from "@/components/analytic";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Analytics /> */}
      {children}
    </>
  );
}
