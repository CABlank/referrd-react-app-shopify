import React from "react";
var MessengerIcon = function () {
    return (<div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 0,
            flexShrink: 0,
            position: "relative",
            gap: "13.33px",
            borderRadius: "5.33px",
            backgroundColor: "#0084ff",
            cursor: "pointer",
        }}>
      <svg width={33} height={32} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0" preserveAspectRatio="xMidYMid meet">
        <path d="M13.5254 0.223074C13.9074 0.154198 14.4272 0.0727987 14.684 0.0414914C14.9407 0.010184 15.8738 -0.00860036 16.7505 0.00392257C18.0155 0.0164455 18.5039 0.0477528 19.0988 0.147936C19.5121 0.223074 20.1321 0.354565 20.4765 0.442225C20.8209 0.529886 21.3845 0.698945 21.729 0.817913C22.0734 0.936881 22.662 1.16855 23.044 1.33761C23.426 1.50667 24.0397 1.81975 24.4217 2.03264C24.8037 2.25179 25.336 2.58365 25.6115 2.77775C25.8871 2.9656 26.3254 3.29745 26.5822 3.50408C26.8389 3.71071 27.3274 4.14901 27.6718 4.48087C28.01 4.80647 28.511 5.34495 28.7865 5.67055C29.062 5.99614 29.4628 6.52211 29.682 6.82892C29.8949 7.14199 30.2519 7.70552 30.471 8.08121C30.684 8.46316 30.9971 9.07678 31.1661 9.45873C31.3352 9.84068 31.5669 10.4293 31.6859 10.7736C31.8049 11.118 31.9677 11.669 32.0554 11.9946C32.1368 12.3202 32.2746 12.9526 32.3497 13.4035C32.4812 14.1298 32.5 14.4053 32.5 16.002C32.5 17.5986 32.4812 17.8741 32.3497 18.6005C32.2746 19.045 32.1368 19.6837 32.0554 20.0093C31.9677 20.3349 31.8049 20.8859 31.6859 21.2303C31.5669 21.5747 31.3352 22.1632 31.1661 22.5452C30.9971 22.9271 30.7278 23.4719 30.5587 23.7662C30.3959 24.0605 30.0828 24.5676 29.8699 24.8932C29.6507 25.2188 29.2875 25.726 29.0495 26.0203C28.8115 26.3146 28.3419 26.8468 27.9912 27.1975C27.6468 27.5544 27.0894 28.0803 26.7513 28.3558C26.4131 28.6376 25.8495 29.0634 25.4988 29.295C25.1481 29.533 24.5908 29.8774 24.2652 30.0589C23.9395 30.2405 23.3759 30.5223 23.0127 30.6851C22.6495 30.8416 22.0734 31.067 21.729 31.186C21.3845 31.305 20.8335 31.4678 20.5078 31.5554C20.1822 31.6368 19.5434 31.7746 19.0988 31.8497C18.3724 31.9812 18.0969 32 16.5 32C14.9031 32 14.6276 31.9812 13.9012 31.8497C13.4503 31.7746 12.8178 31.6368 12.4922 31.5554C12.1665 31.4678 11.6029 31.2987 11.2397 31.1735C10.8765 31.0483 10.2566 30.7978 9.86203 30.6225C9.46751 30.4409 8.86008 30.1341 8.51566 29.9337C8.17123 29.7334 7.63894 29.3952 7.32583 29.1761C7.01272 28.9632 6.49295 28.5625 6.16732 28.287C5.84168 28.0114 5.30313 27.5105 4.9775 27.1724C4.6456 26.828 4.18845 26.3146 3.95049 26.0203C3.71252 25.726 3.34932 25.2188 3.13014 24.8932C2.91722 24.5676 2.60411 24.0605 2.44129 23.7662C2.27221 23.4719 2.00294 22.9271 1.83386 22.5452C1.66477 22.1632 1.43307 21.5747 1.31409 21.2303C1.19511 20.8859 1.03229 20.3349 0.944618 20.0093C0.863209 19.6837 0.72544 19.045 0.650294 18.6005C0.518787 17.8741 0.5 17.5986 0.5 16.002C0.5 14.4053 0.518787 14.1298 0.650294 13.4035C0.72544 12.9526 0.863209 12.3202 0.944618 11.9946C1.03229 11.669 1.19511 11.118 1.31409 10.7736C1.43307 10.4293 1.66477 9.84068 1.83386 9.45873C2.00294 9.07678 2.31605 8.46316 2.52896 8.08121C2.74814 7.70552 3.10509 7.14199 3.318 6.82892C3.53718 6.51584 3.93796 5.99614 4.2135 5.67055C4.48904 5.34495 4.99002 4.80647 5.32818 4.48087C5.6726 4.14901 6.16106 3.71071 6.41781 3.50408C6.67456 3.29119 7.1818 2.92176 7.54501 2.68383C7.90822 2.43963 8.4593 2.10151 8.76614 1.92619C9.07299 1.75087 9.59902 1.49415 9.92466 1.35014C10.2503 1.20612 10.745 1.00576 11.0205 0.905573C11.2961 0.80539 11.8159 0.63633 12.1791 0.536147C12.5423 0.435964 13.1434 0.298211 13.5254 0.223074Z" fill="#0084FF"/>
        <path d="M14.0577 6.63481C14.4209 6.55341 14.9157 6.45949 15.1536 6.42818C15.3916 6.40314 15.9552 6.37183 16.4061 6.36557C16.8507 6.36557 17.4581 6.39061 17.7524 6.42818C18.0468 6.45949 18.4977 6.53463 18.7544 6.58472C19.0112 6.64107 19.5184 6.77883 19.8816 6.89779C20.2448 7.01676 20.8209 7.2547 21.1654 7.41749C21.5098 7.58655 22.0483 7.89337 22.3552 8.09999C22.662 8.30662 23.1317 8.66979 23.3947 8.90772C23.6577 9.1394 24.046 9.53387 24.2589 9.77181C24.4718 10.016 24.8225 10.4668 25.0292 10.7736C25.2358 11.0805 25.5113 11.5626 25.6429 11.8381C25.7744 12.1136 25.956 12.5519 26.0436 12.8086C26.1376 13.0653 26.2691 13.56 26.338 13.9044C26.4068 14.2488 26.482 14.8373 26.5008 15.2193C26.5196 15.62 26.507 16.1835 26.4569 16.5655C26.4194 16.9287 26.3129 17.4922 26.2252 17.8178C26.1438 18.1434 25.9748 18.6506 25.8495 18.9448C25.7305 19.2391 25.48 19.7338 25.2984 20.0406C25.1168 20.3474 24.8037 20.817 24.5971 21.0737C24.3904 21.3305 24.0022 21.7625 23.7266 22.0255C23.4573 22.2947 23.019 22.6642 22.7622 22.8583C22.5055 23.0524 22.0233 23.3654 21.6977 23.547C21.372 23.7286 20.8648 23.9791 20.5704 24.098C20.2761 24.2233 19.7814 24.3923 19.4746 24.48C19.1677 24.5676 18.6542 24.6866 18.3474 24.7492C17.9153 24.8306 17.4706 24.8557 16.4687 24.8557C15.2914 24.8557 15.0722 24.8369 13.5881 24.5301L11.9599 25.4255C11.0644 25.9264 10.3129 26.3271 10.2816 26.3334C10.2566 26.3334 10.2378 25.5507 10.244 22.8583L9.98102 22.6704C9.83699 22.5702 9.42368 22.1758 9.05421 21.7938C8.691 21.4119 8.20881 20.8358 7.98963 20.5102C7.77045 20.1846 7.48865 19.69 7.35088 19.4145C7.21937 19.139 7.03151 18.6568 6.92505 18.35C6.82485 18.0432 6.69335 17.5298 6.63072 17.2229C6.54305 16.8034 6.518 16.3839 6.518 15.595C6.518 14.7371 6.54932 14.4053 6.66204 13.8731C6.73718 13.5099 6.9 12.9464 7.02524 12.6208C7.14423 12.2952 7.36341 11.8005 7.5137 11.525C7.66399 11.2495 7.96458 10.7736 8.18376 10.4668C8.39667 10.16 8.84755 9.64658 9.17319 9.32098C9.49883 9.00165 9.98728 8.57587 10.2503 8.3755C10.5196 8.18139 11.0268 7.8558 11.3775 7.66169C11.7344 7.46133 12.3294 7.18582 12.7114 7.04181C13.0933 6.89779 13.6945 6.71621 14.0577 6.63481Z" fill="white"/>
        <path d="M10.6761 18.0808C10.9704 17.774 12.154 16.5217 13.3063 15.2944C14.4585 14.0672 15.4166 13.0591 15.4354 13.0591C15.4542 13.0591 15.7047 13.3033 15.999 13.6038C16.2871 13.9106 16.8695 14.5117 18.0656 15.7515L20.3826 14.4679C21.6601 13.7604 22.7184 13.1968 22.7497 13.2156C22.7748 13.2281 22.1047 13.967 21.2593 14.8561C20.4139 15.7452 19.2303 16.9913 18.6292 17.6299C18.028 18.2686 17.5145 18.7883 17.4894 18.7883C17.4644 18.7883 16.9196 18.2248 16.2808 17.536C15.6358 16.8473 15.0785 16.2462 15.0346 16.2023C14.9783 16.1335 14.5149 16.3651 12.5986 17.4045C11.3023 18.1121 10.219 18.6819 10.1877 18.6631C10.1626 18.6506 10.3818 18.3876 10.6761 18.0808Z" fill="#2196F3"/>
      </svg>
    </div>);
};
export default MessengerIcon;
