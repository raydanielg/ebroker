import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const PushNotificationLayout = dynamic(() => import('@/components/wrapper/PushNotificationLayout'), { ssr: false })
const VerticleLayout = dynamic(() => import('@/components/user-layout/VerticleLayout'), { ssr: false })
const UserRoot = dynamic(() => import('@/components/user/UserRoot'), { ssr: false })

const UserDashBoardPage = () => {
    const [notificationData, setNotificationData] = useState(null)
    const handleNotificationReceived = (data) => {
        setNotificationData(data)
    }
    return (
        <PushNotificationLayout onNotificationReceived={handleNotificationReceived}>
            <VerticleLayout>
                <UserRoot notificationData={notificationData} />
            </VerticleLayout>
        </PushNotificationLayout>
    )
}

export default UserDashBoardPage