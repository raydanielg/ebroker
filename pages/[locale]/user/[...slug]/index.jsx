import React from 'react'
import UserDashBoardPage from '@/components/pagescomponents/UserDashboardPage'
import MetaData from '@/components/meta/MetaData'
import axios from 'axios'
import { GET_SEO_SETTINGS } from '@/api/apiEndpoints';

const fetchDataFromSeo = async (page) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_SEO_SETTINGS}?page=chat`
        );

        const SEOData = response.data;
        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

const UserSlugPage = ({ slug, seoData, pageName }) => {
    // Join slug array for display in the meta title
    let metaTitle = '', metaDescription = '', metaKeywords = '', metaImage = '', page = '';
    if (slug?.[0] === 'chat') {
        metaTitle = seoData?.data?.[0]?.meta_title;
        metaDescription = seoData?.data?.[0]?.meta_description;
        metaKeywords = seoData?.data?.[0]?.meta_keywords;
        metaImage = seoData?.data?.[0]?.meta_image;
        page = seoData?.data?.[0]?.page;
    } else {
        // const slugTitle = slug ? Array.isArray(slug) ? slug?.join('/') : `${slug?.charAt(0)?.toUpperCase()}${slug?.slice(1)}` : '';
        metaTitle = process.env.NEXT_PUBLIC_META_TITLE;
        metaDescription = seoData?.data?.[0]?.meta_description;
        metaKeywords = seoData?.data?.[0]?.meta_keywords;
        metaImage = seoData?.data?.[0]?.meta_image;
        page = seoData?.data?.[0]?.page;
    }

    return (
        <div>
            <MetaData
                title={metaTitle}
                description={metaDescription}
                keywords={metaKeywords}
                pageName={page}
                structuredData={seoData?.data?.[0]?.schema_markup}
            />
            <UserDashBoardPage />
        </div>
    )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req, params } = context;

        const pageName = req?.url;
        const slug = params?.slug;
        const seoData = await fetchDataFromSeo(req.url);
        return {
            props: {
                seoData,
                pageName,
                slug,
            },
        };
    };
}

export const getServerSideProps = serverSidePropsFunction;

export default UserSlugPage 