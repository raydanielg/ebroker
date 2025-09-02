import { GET_SEO_SETTINGS } from '@/api/apiEndpoints'
import MetaData from '@/components/meta/MetaData'
import axios from 'axios'
import dynamic from 'next/dynamic'
const ListingsPage = dynamic(() => import('@/components/pagescomponents/ListingsPage'), { ssr: false })

const fetchDataFromSeo = async (page) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_SEO_SETTINGS}?page=${page}`
        );

        const SEOData = response.data;

        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};
const index = ({ seoData, pageName }) => {
    return (
        <div>
            <MetaData
                title={seoData?.data?.[0]?.meta_title}
                description={seoData?.data?.[0]?.meta_description}
                keywords={seoData?.data?.[0]?.meta_keywords}
                ogImage={seoData?.data?.[0]?.meta_image}
                pageName={pageName}
                structuredData={seoData?.data?.[0]?.schema_markup}
            />
            <ListingsPage />
        </div>
    )
}
let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async ({ params }) => {
        const { slug, locale } = params;
        const pageName = "/" + locale + '/all/' + slug + '/';
        const seoData = await fetchDataFromSeo(slug);
        return {
            props: { seoData, pageName },
        };
    };
}
export const getServerSideProps = serverSidePropsFunction;
export default index