import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'


const FaqItem = ({ faq, value }) => {

    return (
        <AccordionItem value={faq?.id} className="border rounded-lg data-[state=open]:shadow-lg">
            <AccordionTrigger className="data-[state=open]:brandBg data-[state=open]:text-white border-none flex justify-between items-center w-full hover:no-underline text-base py-4 px-5 rounded-t-lg transition-all duration-500 ease-in-out group">
                {faq?.translated_question || faq?.question}
                <FiPlusCircle size={24} className="group-data-[state=open]:hidden" />
                <FiMinusCircle size={24} className="group-data-[state=closed]:hidden" />
            </AccordionTrigger>
            <AccordionContent className="py-2 px-5 text-base leadColor font-medium">
                {faq?.translated_answer || faq?.answer}
                {/* <div dangerouslySetInnerHTML={{ __html: faq?.answer }} /> */}
            </AccordionContent>
        </AccordionItem>
    )
}

export default FaqItem