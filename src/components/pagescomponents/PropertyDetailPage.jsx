import React from 'react'
import Layout from '../layout/Layout'
import dynamic from 'next/dynamic'

const PropertyDetail = dynamic(() => import('../property-detail/PropertyDetail'), {
    ssr: false
})

const PropertyDetailPage = () => {
    return (
        <Layout>
            <PropertyDetail />
        </Layout>
    )
}

export default PropertyDetailPage