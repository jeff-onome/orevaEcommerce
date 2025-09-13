
import React, { useState } from 'react';
import Button from '../Button';

const faqs = [
    { q: "How do I track my order?", a: "You can track your order using the 'Track Order' tab in your profile. Just enter the last 6 digits of your order ID." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy for unused items in their original packaging. Please contact support to initiate a return." },
    { q: "How long does shipping take?", a: "Standard shipping typically takes 5-7 business days. Expedited options are available at checkout." },
    { q: "Can I change my shipping address?", a: "If your order has not yet shipped, we may be able to update the address. Please contact us immediately through the message center." },
];

const AccordionItem: React.FC<{ faq: { q: string, a: string } }> = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50"
            >
                <span className="font-semibold">{faq.q}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50 text-gray-700 animate-fade-in">
                    <p>{faq.a}</p>
                </div>
            )}
        </div>
    )
}

const HelpAndSupport: React.FC = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Your support request has been submitted. We will get back to you shortly.");
        // Here you would typically handle form submission
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="animate-slide-in-up space-y-10">
            <div>
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="border rounded-lg overflow-hidden">
                    {faqs.map((faq, index) => <AccordionItem key={index} faq={faq} />)}
                </div>
            </div>
            <div>
                 <h2 className="text-2xl font-bold mb-6">Still Need Help?</h2>
                 <p className="mb-4 text-gray-600">Fill out the form below, and our support team will get back to you as soon as possible.</p>
                 <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
                     <input type="text" placeholder="Subject" className="w-full p-3 border rounded-md" required />
                     <textarea placeholder="Please describe your issue..." rows={5} className="w-full p-3 border rounded-md" required />
                     <Button type="submit">Submit Request</Button>
                 </form>
            </div>
        </div>
    );
};

export default HelpAndSupport;
