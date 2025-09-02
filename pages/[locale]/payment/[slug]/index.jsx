import MetaData from '@/components/meta/MetaData'
import dynamic from 'next/dynamic'
import React from 'react'
const PaymentCheckPage = dynamic(() => import('@/components/pagescomponents/PaymentCheckPage'), { ssr: false })

const index = () => {
    return (
        <div>
            <MetaData
                title={`Payment - ${process.env.NEXT_PUBLIC_META_TITLE}`}
                description={process.env.NEXT_PUBLIC_META_DESCRIPTION}
                keywords={process.env.NEXT_PUBLIC_META_KEYWORDS}
                pageName="/payment"
            />
            <PaymentCheckPage />
        </div>
    )
}

export default index