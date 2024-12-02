import { ReactNode } from "react";

type HeaderProps = {
  type: HeaderTypes;
  children?: ReactNode;
};

type HeaderTypes = "h1" | "h2" | "h3";

export default function Header({ type, children }: HeaderProps) {
  switch (type) {
    case "h1":
      return <h1 className="text-xl block font-semibold">{children}</h1>;
      break;
    case "h2":
      return <h2 className="text-lg block font-semibold">{children}</h2>;
      break;
    case "h3":
      return <h3 className="text-base block font-semibold">{children}</h3>;
      break;
    default:
      return <p className="text-lg block font-semibold">{children}</p>;
      break;
  }
}
