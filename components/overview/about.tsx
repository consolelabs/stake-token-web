import { Typography } from "@mochi-ui/core";
import { FireSolid } from "@mochi-ui/icons";
import Color from "color";
import { utils } from "@consolelabs/mochi-formatter";
import { useServerInfo } from "@/store/server-info";

const colors = [
  Color("#4C5054"),
  Color("#C8A38B"),
  Color("#2F6ED1"),
  Color("#538E22"),
  Color("#D77F31"),
  Color("#9198E6"),
  Color("#E66C9F"),
  Color("#E98405"),
  Color("#F5B938"),
  Color("#3EBBD6"),
  Color("#7F747A"),
];

function Cell({
  index = 0,
  img,
  title,
  subtitle,
}: {
  index?: number;
  title: string;
  subtitle: string | number;
  img?: React.ReactNode;
}) {
  return (
    <div className="flex gap-x-4 py-2 px-4">
      {img ?? (
        <div
          style={{ backgroundColor: colors[index].hexa() }}
          className="flex justify-center items-center w-8 h-8 rounded-full aspect-square"
        >
          <FireSolid className="text-white" />
        </div>
      )}
      <div className="flex flex-col">
        <Typography level="p6" className="font-medium text-neutral-500">
          {title}
        </Typography>
        <Typography level="p5" className="font-medium">
          {subtitle}
        </Typography>
      </div>
    </div>
  );
}

export function About() {
  const { data } = useServerInfo();

  return (
    <div className="flex flex-col py-6">
      <div className="flex flex-col gap-y-2">
        <Typography level="h5" className="font-medium">
          {" "}
          About
        </Typography>
        <div className="flex flex-col gap-y-4 font-light">
          <Typography>
            Dwarves Foundation is a software development firm based in Asia.
            Helping tech startups, entrepreneurs build and scale world-class
            products since 2013.
          </Typography>
          <Typography>
            Our approach to technologies and people is tailored to each product.
            You will always work with team of experts who understand your end
            goal and support you all the way to the finish line, no matter where
            it is in the product lifecycle.
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-3 auto-rows-auto gap-4 py-8">
        <Cell
          img={
            <div
              style={{
                background:
                  "linear-gradient(38deg, rgba(255, 65, 110, 0.20) 25.6%, rgba(3, 0, 142, 0.20) 87.4%)",
              }}
              className="p-1 w-8 h-8 rounded-full"
            >
              <img src="/dfg-token.png" alt="" />
            </div>
          }
          title="Token Ticker"
          subtitle="$DFG"
        />
        <Cell
          index={0}
          title="Blockchain"
          subtitle={data?.overview.about.token.chain ?? ""}
        />
        <Cell
          index={1}
          title="ATH"
          subtitle={utils.formatUsdDigit(
            data?.overview.about.token.all_time_high ?? 0
          )}
        />
        <Cell
          index={2}
          title="Market Cap"
          subtitle={utils.formatUsdDigit({
            value: data?.overview.about.token.market_cap ?? 0,
            shorten: false,
          })}
        />
        <Cell
          index={3}
          title="Price"
          subtitle={utils.formatUsdDigit(data?.overview.about.token.price ?? 0)}
        />
        <Cell
          index={4}
          title="FDV"
          subtitle={utils.formatUsdDigit(
            data?.overview.about.token.full_diluted_valuation ?? 0
          )}
        />
        <Cell
          index={5}
          title="24 Hour Trading Vol"
          subtitle={utils.formatUsdDigit(
            data?.overview.about.token.trading_volume_24h ?? 0
          )}
        />
        <Cell
          index={6}
          title="Max Supply"
          subtitle={data?.overview.about.token.max_supply ?? 0}
        />
        <Cell index={7} title="Age" subtitle="9 years" />
        <Cell
          index={8}
          title="Change (H1)"
          subtitle={utils.formatPercentDigit(
            data?.overview.about.token.change_h1 ?? 0
          )}
        />
        <Cell
          index={9}
          title="Change (D1)"
          subtitle={utils.formatPercentDigit(
            data?.overview.about.token.change_d1 ?? 0
          )}
        />
        <Cell
          index={10}
          title="Change (W1)"
          subtitle={utils.formatPercentDigit(
            data?.overview.about.token.change_w1 ?? 0
          )}
        />
      </div>
    </div>
  );
}
