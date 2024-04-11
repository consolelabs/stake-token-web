import { useCountdown } from "@/hooks/useCountdown";
import { Badge } from "@mochi-ui/core";

interface Props {
  finishTime: number;
  children: React.ReactNode;
}

export const Countdown = (props: Props) => {
  const { finishTime, children } = props;
  const currentTime = finishTime ? Math.floor(Date.now() / 1000) : 0;
  const { countDown, hours, minutes, seconds } = useCountdown(
    finishTime ? finishTime - currentTime : 0
  );

  return countDown ? (
    <Badge
      appearance="warning"
      className="w-fit border border-warning-soft-active ml-auto"
    >
      {`${hours}h ${minutes}m ${seconds}s`}
    </Badge>
  ) : (
    <>{children}</>
  );
};
