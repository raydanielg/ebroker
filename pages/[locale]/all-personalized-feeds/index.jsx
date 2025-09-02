import React from 'react'
import MetaData from '@/components/meta/MetaData'
import UserPersonalizedFeedsPage from '@/components/pagescomponents/UserPersonalizedFeedsPage'
import axios from 'axios';
import { GET_SEO_SETTINGS } from '@/api/apiEndpoints';

const fetchDataFromSeo = async (page) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_SEO_SETTINGS}?page=featured-properties`
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
            <UserPersonalizedFeedsPage />
        </div>
    )
}
let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req } = context; // Extract query and request object from context
        const pageName = req.url;
        const seoData = await fetchDataFromSeo(pageName);
        // Pass the fetched data as props to the page component
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