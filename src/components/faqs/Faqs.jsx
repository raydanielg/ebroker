import FaqItem from './FaqItem'
import { useTranslation } from '../context/TranslationContext'
import {
    Accordion,
} from "@/components/ui/accordion"
import CustomLink from '../context/CustomLink'
import { MdArrowForward } from 'react-icons/md'
import { isRTL } from '@/utils/helperFunction'


const Faqs = ({ translated_title, title, faqs }) => {
    const t = useTranslation()
    const isRtl = isRTL()


    return (
        <section className='cardBg'>
            <div className='container py-5 px-5 md:py-12 lg:py-[60px]'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    <div className='flex flex-col col-span-6 gap-8'>
                        <h1 className='text-xl lg:text-2xl xl:text-4xl text-left font-bold col-span-6'>{translated_title || title}</h1>
                        <p className='col-span-6 secondryTextColor text-left'>{t("faqDescription")}</p>
                        <CustomLink href={"/faqs"} className="w-fit px-4 py-3 rounded-md border brandBorder brandColor hover:brandBg hover:border-transparent hover:text-white transition-all duration-300 flex items-center gap-2">
                            {t("readMoreFAQs")}
                            <MdArrowForward className={`${isRtl ? "rotate-180" : ""}`} />
                        </CustomLink>
                    </div>
                    <div className='col-span-6'>
                        <Accordion type="single" collapsible className="w-full">
                            <div className='flex flex-col gap-4'>
                                {faqs?.map((faq, index) => {
                                    return (
                                        <div key={faq?.id}>
                                            <FaqItem faq={faq} value={`item-${index}`} />
                                        </div>
                                    )
                                })}
                            </div>
                        </Accordion>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Faqs