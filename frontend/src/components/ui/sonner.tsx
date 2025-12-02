import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(0, 0, 0, 0.9)",
          "--normal-text": "white",
          "--normal-border": "rgba(255, 255, 255, 0.1)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
