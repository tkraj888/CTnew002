import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const CUSTOM_ANIMATION = {
  mount: { scale: 1, opacity: 1 },
  unmount: { scale: 0.95, opacity: 0 },
};

export function AccordionCustom() {
  const [open, setOpen] = React.useState(1);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const questions = [
    {
      id: 1,
      question: "When and Where I can take test drive?",
      answer:
        "You can schedule a home test drive for this Autocar assured car at any date and time you find convenient using our test drive booking form. Your assigned Autocar Relationship Manager will then reach out to you and make sure all the details of your preferred car are made available to you before arriving at your home on the selected date & time for the test drive.",
    },
    {
      id: 2,
      question: "What benefits CarTechIndia give us?",
      answer:
        "Accessing helpful tips and advice on maintaining a second hand car. Hassle-free-trade-in program for your current vehicle.",
    },
    {
      id: 3,
      question: "How do I book a car of my choice?",
      answer:
        "You can book a car. If you complete the purchase of the vehicle within the holding period, the deposit will be applied towards the purchase otherwise the booking amount will be refunded back to you and the booking cancelled.",
    },
    {
      id: 4,
      question: "Is replacement option available?",
      answer:
        "Absolutely yes, replacement option is available and hassle-free-trade-in program for your current vehicle.",
    },
    {
      id: 5,
      question: "Will CarTechIndia give us history of vehicle?",
      answer:
        "Yes, We verify important details such as ownership history, accident records, and maintenance records.",
    },
    {
      id: 6,
      question: "Will CarTechIndia help me with car finance?",
      answer:
        "Absolutely, buyers can choose to avail financing through Autocar wherein we would get the loan processed through our finance partners. Our established partnerships help us process loans faster and get our customers better interest rates. Depending on your credit worthiness, you can avail used car loans through Autocar at interest rates as low as 12.99% compared to the market rates of 14-16%.",
    },
    {
      id: 7,
      question: "Will CarTechIndia give us extended warranty?",
      answer:
        "Protect your investment with our extended warranty options. Get peace of mind knowing that your second-hand car is covered against unexpected repairs.",
    },
  ];

  return (
    <div className="container px-4 mt-20 max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-gray-800">
        Frequently Asked Questions
      </h2>

      {questions.map(({ id, question, answer }) => (
        <Accordion
          key={id}
          open={open === id}
          animate={CUSTOM_ANIMATION}
          className="mb-4 rounded-xl shadow-md bg-white border border-gray-200 transition-all duration-300"
        >
          <AccordionHeader
            onClick={() => handleOpen(id)}
            className="text-lg md:text-xl px-6 py-4 font-medium text-gray-800 flex justify-between items-center cursor-pointer"
          >
            <span>{question}</span>
            <span
              className={`ml-auto transform transition-transform duration-300 ${
                open === id ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </AccordionHeader>
          <AccordionBody className="px-6 pb-6 pt-2 text-sm md:text-base text-gray-700">
            {answer}
          </AccordionBody>
        </Accordion>
      ))}
    </div>
  );
}
