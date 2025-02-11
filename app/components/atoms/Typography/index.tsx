import { FC } from "react";
import TypographyProps from "./index.types";
import classNames from "classnames";

const Typography: FC<TypographyProps> = ({ children, variant, className }) => {
  switch (variant) {
    case "h2":
      return (
        <h2
          className={classNames(
            "font-bold text-light-blue text-[27px] tablet:text-[35px] laptop:text-[40px] leading-[56px] text-center",
            className ?? ""
          )}
        >
          {children}
        </h2>
      );
    case "p":
      return <></>;
  }
};

export default Typography;
