import React from 'react'
import { useRouter } from 'next/router'
import PropertyList from '@/components/pagescomponents/PropertyList'
import MetaData from '@/components/meta/MetaData'
import axios from 'axios';
import { GET_CATEGORES } from '@/api/apiEndpoints';

const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_CATEGORES}?slug_id=${slug}`
        );

        const SEOData = response.data;


        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

const CategoryPropertiesPage = ({ seoData, pageName, slug }) => {

    // // Handle potential missing slug during initial render
    const categorySlugName = typeof slug === 'string' ? slug : '';
    // Ideally, fetch the actual category name based on the slug for a better title
    const formattedCategoryName = categorySlugName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Basic formatting

    const metaTitle = categorySlugName
        ? `${formattedCategoryName} Properties - ${process.env.NEXT_PUBLIC_META_TITLE || 'eBroker'}`
        : `Category Properties - ${process.env.NEXT_PUBLIC_META_TITLE || 'eBroker'}`; // Fallback title

    return (
        <div>
            <MetaData
                title={metaTitle}
                description={seoData?.data?.[0]?.meta_description}
                keywords={seoData?.data?.[0]?.meta_keywords}
                ogImage={seoData?.data?.[0]?.meta_image}
                pageName={pageName}
                structuredData={seoData?.data?.[0]?.schema_markup}
            />
            {/* Pass the categorySlug prop */}
            <PropertyList isCategoryPage={true} />
        </div>
    )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req, params } = context; // Extract query and request object from context
        // Accessing the slug property
        const slugValue = params?.slug;
        const pageName = req?.url;
        const seoData = await fetchDataFromSeo(slugValue);

        return {
            props: {
                seoData,
                slug: slugValue,
                pageName,
            },
        };
    };
}
export const getServerSideProps = serverSidePropsFunction;
export default CategoryPropertiesPage;