import { GET_PROPETRES } from '@/api/apiEndpoints';
import MetaData from '@/components/meta/MetaData';
import dynamic from 'next/dynamic';
const PropertyDetailPage = dynamic(() => import('@/components/pagescomponents/PropertyDetailPage.jsx'), {
    ssr: false,
});
// import PropertyDetailPage from '@/components/pagescomponents/PropertyDetailPage';
import axios from 'axios';

const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_PROPETRES}?slug_id=${slug}&with_seo=1`
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
                pageName={seoData?.data?.[0]?.page || pageName}
                structuredData={seoData?.data?.[0]?.schema_markup}
            />
            <PropertyDetailPage />
        </div>
    )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req, params } = context;

        const slugValue = params?.slug;
        const pageName = req?.url;

        const seoData = await fetchDataFromSeo(slugValue);
        return {
            props: {
                seoData,
                pageName,
            },
        };
    };
}
export const getServerSideProps = serverSidePropsFunction;
export default index