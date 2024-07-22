// components/FallbackLogo.tsx
import React from "react";

const FallbackLogo = () => (
  <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[69px] w-[69px] relative overflow-hidden gap-2.5 px-0.5 py-[5px] rounded-[32px] bg-[#851087]/[0.15]">
    <svg
      width={31}
      height={32}
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-grow-0 flex-shrink-0 w-[29.5px] h-[29.5px]"
      preserveAspectRatio="none"
    >
      <path
        d="M21.4 7.15C21.4 4.36815 21.4 2.9787 20.5356 2.11435C19.6713 1.25 18.2819 1.25 15.5 1.25C12.7182 1.25 11.3287 1.25 10.4644 2.11435C9.6 2.9787 9.6 4.36815 9.6 7.15M0.75 18.95C0.75 13.3878 0.75 10.6059 2.4787 8.8787C4.20592 7.15 6.98778 7.15 12.55 7.15H18.45C24.0122 7.15 26.7941 7.15 28.5213 8.8787C30.25 10.6059 30.25 13.3878 30.25 18.95C30.25 24.5122 30.25 27.2941 28.5213 29.0213C26.7941 30.75 24.0122 30.75 18.45 30.75H12.55C6.98778 30.75 4.20592 30.75 2.4787 29.0213C0.75 27.2941 0.75 24.5122 0.75 18.95Z"
        stroke="#9F43A0"
        stroke-width="1.5"
      />
      <path
        d="M22.875 11.5751C22.875 11.9663 22.7196 12.3415 22.443 12.6181C22.1664 12.8947 21.7912 13.0501 21.4 13.0501C21.0088 13.0501 20.6336 12.8947 20.357 12.6181C20.0804 12.3415 19.925 11.9663 19.925 11.5751C19.925 11.1839 20.0804 10.8087 20.357 10.5321C20.6336 10.2555 21.0088 10.1001 21.4 10.1001C21.7912 10.1001 22.1664 10.2555 22.443 10.5321C22.7196 10.8087 22.875 11.1839 22.875 11.5751ZM11.075 11.5751C11.075 11.9663 10.9196 12.3415 10.643 12.6181C10.3664 12.8947 9.99119 13.0501 9.6 13.0501C9.20881 13.0501 8.83363 12.8947 8.55702 12.6181C8.2804 12.3415 8.125 11.9663 8.125 11.5751C8.125 11.1839 8.2804 10.8087 8.55702 10.5321C8.83363 10.2555 9.20881 10.1001 9.6 10.1001C9.99119 10.1001 10.3664 10.2555 10.643 10.5321C10.9196 10.8087 11.075 11.1839 11.075 11.5751Z"
        fill="#9F43A0"
      />
    </svg>
  </div>
);

export default FallbackLogo;
