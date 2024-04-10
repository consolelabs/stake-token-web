import useSWR from "swr";
import Image from "next/image";

interface Props {
  symbol?: string;
  size?: number;
}

export const TokenImage = (props: Props) => {
  const { symbol = "", size = 20 } = props;
  const { data } = useSWR(
    `https://api-preview.mochi.console.so/api/v1/product-metadata/emoji?codes=${symbol}`,
    (url) => fetch(url).then((res) => res.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <Image
      src={
        data?.data[0]?.emoji_url ||
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk8AEAAFIATgDK/mEAAAAASUVORK5CYII="
      }
      alt={symbol}
      width={size}
      height={size}
    />
  );
};
