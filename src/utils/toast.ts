import Toaster from "toastify-js";

export const toast = ({
  duration = 3000,
  gravity = "bottom",
  position = "right",
  style: propStyle,
  ...options
}: Toaster.Options) => {
  const style: {
    [cssRule: string]: string;
  } = { "border-radius": "15px", ...propStyle };

  return Toaster({
    duration,
    gravity,
    position,
    style,
    ...options,
  }).showToast();
};
