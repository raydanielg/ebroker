import { GET_ARTICLES } from '@/api/apiEndpoints';
import MetaData from '@/components/meta/MetaData';
import ArticleDetailsPage from '@/components/pagescomponents/ArticleDetailsPage';
import axios from 'axios';

const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_ARTICLES}?slug_id=${slug}&with_seo=1`
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
                title={seoData?.data?.[0]?.meta_title || undefined}
                description={seoData?.data?.[0]?.meta_description || undefined}
                keywords={seoData?.data?.[0]?.meta_keywords || undefined}
                ogImage={seoData?.data?.[0]?.meta_image || undefined}
                pageName={seoData?.data?.[0]?.page || pageName}
                structuredData={seoData?.data?.[0]?.schema_markup}
            />
            <ArticleDetailsPage />
        </div>
    )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { params, req } = context; // Extract query and request object from context
        // Accessing the slug property
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