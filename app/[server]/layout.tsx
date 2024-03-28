import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverList } from "@/constants/servers";

type Props = {
  params: { server: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const {
    params: { server },
  } = props;
  const serverName = serverList.find((s) => s.id === server)?.name;

  if (!serverName) return {};

  return {
    title: `${serverName} Earning`,
    openGraph: {
      title: `${serverName} Earning`,
    },
  };
}

export default function Layout({
  children,
  ...props
}: { children: React.ReactNode } & Props) {
  const {
    params: { server },
  } = props;
  const serverInfo = serverList.find((s) => s.id === server);

  if (!serverInfo) return notFound();

  return <>{children}</>;
}
