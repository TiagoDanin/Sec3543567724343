import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Três variantes, como manda o DESIGN.md. Sem canto arredondado e sem sombra:
// o botão é bloco cheio de cor ou filete de 1px.
const button = cva(
  [
    "inline-flex items-center justify-center gap-[0.7em]",
    "font-mono text-[13px] font-bold uppercase leading-[1.1] tracking-[0.08em]",
    "cursor-pointer border border-transparent bg-transparent",
    "transition-colors duration-280 ease-brand",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-orange border-orange text-ink hover:bg-transparent hover:text-orange-2 hover:border-orange-2 focus-visible:bg-transparent focus-visible:text-orange-2 focus-visible:border-orange-2",
        ghost:
          "text-cream border-line-2 hover:border-mint hover:text-mint focus-visible:border-mint focus-visible:text-mint",
        mint: "text-mint border-mint hover:bg-mint hover:text-ink focus-visible:bg-mint focus-visible:text-ink",
      },
      size: {
        sm: "px-5 py-[11px] text-[12px]",
        md: "px-7 py-4",
        lg: "px-[34px] py-[19px] text-[14px]",
      },
      full: {
        true: "mt-auto w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof button> & {
  children: ReactNode;
  className?: string;
  /** Seta reta para navegação interna. */
  arrow?: boolean;
};

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href: string };

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: never };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button({ variant, size, full, arrow, className, children, ...props }: ButtonProps) {
  // Seta diagonal automática em link externo e em download — o leitor precisa
  // saber que sai do site antes de clicar.
  const rest = props as Record<string, unknown>;
  const isExternal = rest.target === "_blank";
  const hasDownload = rest.download !== undefined;

  const classes = cn(
    button({ variant, size, full }),
    (arrow || isExternal || hasDownload) && "btn-ico after:block",
    arrow && "btn-ico-arrow",
    (isExternal || hasDownload) && !arrow && "btn-ico-out",
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
