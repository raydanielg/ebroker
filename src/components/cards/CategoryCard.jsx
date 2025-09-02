import { useTranslation } from '../context/TranslationContext';
import { MdArrowForward } from 'react-icons/md';
import CustomLink from '../context/CustomLink';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { isRTL } from '@/utils/helperFunction';

const CategoryCard = ({ category }) => {
    const t = useTranslation();
    const webSettings = useSelector(state => state.WebSetting?.data)
    const isRtl = isRTL()
    return (
        <CustomLink href={`/properties/category/${category?.slug_id}`} className='bg-white relative rounded-2xl p-4 border flex flex-col lg:flex-row justify-center md:justify-normal items-center gap-6 group transition-colors duration-300 ease-in-out overflow-hidden hover:cursor-pointer hover:cardHoverShadow hover:bg-white hover:border-primaryColor'>
            <div className='bg-[#F5F5F4] group-hover:primaryBg rounded-[8px] p-3 flex items-center justify-center transition-colors duration-500 ease-in-out'>
                <ReactSVG
                    src={category?.image}
                    beforeInjection={(svg) => {
                        svg.querySelectorAll("path,text,tspan,circle").forEach((path) => {
                            path.setAttribute(
                                "style",
                                `fill: ${webSettings?.system_color}`,
                            );
                            path.classList.add("transition-all");
                            path.classList.add("duration-500");
                            path.classList.add("ease-in-out");
                            path.classList.add("group-hover:!fill-white");
                        });
                        svg.setAttribute(
                            "style",
                            `height: 48px; width: 48px;`,
                        );
                    }}
                    className={`flex w-12 h-12 items-center justify-center object-cover`}
                    alt={category?.translated_name || category?.category}
                />
            </div>
            <div className='flex flex-col items-center lg:items-start gap-3'>
                <span className='text-base md:text-xl font-bold line-clamp-1 transition-colors duration-300 ease-in-out group-hover:text-primary'>{category?.translated_name || category?.category}</span>
                {category?.properties_count > 0 && <span className='text-sm md:text-base sm:text-center md:text-start w-full font-normal text-[#595F65] transition-all duration-500 ease-in-out group-hover:opacity-0'>{category?.properties_count} {t("properties")}</span>}
                {category?.properties_count === 0 && <span className='h-6' />}
            </div>
            <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2  translate-y-full group-hover:-translate-y-3 bg-white primaryColor p-2 flex items-center gap-1 justify-center transition-all duration-500 ease-in-out ${isRtl ? "lg:left-[calc(100%-182px)]" : "lg:left-[182px]"}`}
            >
                <span className='text-sm text-nowrap md:text-base'>{t("view")} {t("properties")}</span>
                <MdArrowForward className={`primaryColor ${isRtl ? "rotate-180" : ""}`} />
            </div>
        </CustomLink>
    )
}

export default CategoryCard
