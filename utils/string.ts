export function boringAvatar(name = "", variant: "beam" | "ring" = "beam") {
  return `https://source.boringavatars.com/${variant}/120/${name}?colors=665c52,74b3a7,a3ccaf,E6E1CF,CC5B14`;
}

export function truncateWallet(address?: string) {
  if (!address || address.length < 30) {
    return address;
  }

  const first = address.slice(0, 5);
  const last = address.slice(-4);

  return `${first}...${last}`;
}
