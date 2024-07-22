import React, { useState } from "react";

const Divider = () => (
  <svg
    width={1283}
    height={1}
    viewBox="0 0 1283 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="self-stretch w-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <line
      x1="0.25"
      y1="0.75"
      x2="1282.75"
      y2="0.75"
      stroke="black"
      strokeOpacity="0.15"
      strokeWidth="0.5"
      strokeLinecap="round"
      className="stroke-2 md:stroke-[0.5]"
    />
  </svg>
);

interface FAQItemProps {
  question: string;
  answer?: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => (
  <>
    <div
      className="flex justify-between items-center h-[52px] py-4 w-full cursor-pointer"
      onClick={onClick}
    >
      <p className="text-base text-left text-black/80">{question}</p>
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        preserveAspectRatio="none"
      >
        <path
          d="M18.75 8.625L12 15.375L5.25 8.625"
          stroke="black"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={isOpen ? "rotate(180)" : ""}
        />
      </svg>
    </div>
    {isOpen && answer && (
      <div className="flex justify-start items-center w-full gap-3 p-4 rounded-lg bg-[#851087]/[0.03]">
        <p className="text-base text-left text-black/50">{answer}</p>
      </div>
    )}
    <Divider />
  </>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Where are my bank details stored?",
      answer:
        "All customers financial details are stored with Wise www.wise.com, one of the words leading global payment platforms. Referrd does not store any bank details.",
    },
    {
      question: "Who is Wise?",
      answer:
        "Wise is a global payment platform that allows businesses and individuals to send money around the world across multiple currencies. They service close to 300,000 businesses globally and are supported by the highest financial institutional security systems.",
    },
    {
      question: "How do I create a campaign (Brand)?",
      answer:
        "Click on the campaign tab on the let hand side of the portal, following the simple 5 step process to create a campaign. You can preview your pop up in the creation page. Once you have paid for your campaign via Stripe you account will be live and ready for you to use.",
    },
    {
      question: "How often do I get paid (Customer)?",
      answer:
        "As soon as a brand approves payments in the portal your cash gets automatically paid through Wise into your allocated bank account. We have recommended brands approve payments weekly at a minimum frequency.",
    },
    {
      question: "Who can I share to?",
      answer:
        "As a customer you can share to anyone you would like to. You can share via all the social mediums available as well as email, SMS and Whatsapp.",
    },
    {
      question: "How do I share?",
      answer:
        "All customers can share via the pop up on the brands platform or via the Share tab on the left hand side of the portal. Customers can click on any of the icons and this will direct you to the ability to share. You can share the standard message or curate your own.",
    },
    {
      question: "What if I haven’t been paid?",
      answer:
        "If for some reason you have not been paid you have two options: <br> 1. Reach out to the brand directly through their customer service teams to find out why you have not been paid. <br> 2. Reach out to Referrd via our customer service portal and we can check the system as to why this payment has not gone through",
    },
    {
      question: "How do I update my details?",
      answer:
        "All customers can go in to the settings tab in your account and update any of your details at any time. The system will allow one change of banking details before it will lock you out and request the customer to contact Referrd directly to update",
    },
    {
      question: "Can I share to anyone?",
      answer:
        "Yes, you can share to anyone that you have direct access to, the more people you share to across more channels the larger the chance you have of getting paid more cash.",
    },
    {
      question: "How much do I get paid for a referral?",
      answer:
        "Each brand will pay you a different amount per campaign, this will be made visible on the pop ups as well as the in the share tab on the portal. The more of your contacts that buy the ore you get paid.",
    },
    {
      question: "If I have questions about the product offer who do I contact?",
      answer:
        "For all product offers you will need to contact the brand directly.",
    },
    {
      question: "If I have questions about Referrd how do I contact them?",
      answer:
        "You can contact Referrd via the support tab in the portal, we will respond within this section for you to track.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col justify-start items-start max-w-full gap-2 p-8 rounded-2xl bg-white">
      <div className="flex items-start h-[42px] gap-3 bg-white">
        <p className="text-xl font-medium text-left text-[#10ad1b]">FAQs</p>
      </div>
      <Divider />
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default FAQ;
