import PropertyList from '@/components/pagescomponents/PropertyList';
import MetaData from '@/components/meta/MetaData';
import axios from 'axios';
import { GET_SEO_SETTINGS } from '@/api/apiEndpoints';

const fetchDataFromSeo = async (slug) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_SEO_SETTINGS}?page=properties-nearby-city`
        );

        const SEOData = response.data;


        return SEOData;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

const CityPropertiesPage = ({ seoData, currentURL, slug, pageName }) => {

    const slugName = `Properties in ${slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${process.env.NEXT_PUBLIC_META_TITLE}`;
    return (
        <div>
            <MetaData
                title={seoData?.data?.[0]?.meta_title || slugName}
                description={seoData?.data?.[0]?.meta_description}
                keywords={seoData?.data?.[0]?.meta_keywords}
                ogImage={seoData?.data?.[0]?.meta_image}
                pageName={pageName}
                structuredData={seoData?.data?.[0]?.schema_markup}
            />
            {/* Pass the citySlug prop */}
            <PropertyList isCityPage={true} />
        </div>
    )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
    serverSidePropsFunction = async (context) => {
        const { req } = context; // Extract query and request object from context
        const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
        // Accessing the slug property
        const slugValue = params.slug;
        const path = req.url;

        // const currentURL = `${req.headers.host}${req.url}`;
        const currentURL = process.env.NEXT_PUBLIC_WEB_URL + '/properties/city/' + slugValue + '/';


        const seoData = await fetchDataFromSeo(slugValue);

        return {
            props: {
                seoData,
                currentURL,
                slug: slugValue,
                pageName: path
            },
        };
    };
}
export const getServerSideProps = serverSidePropsFunction;

export default CityPropertiesPage