"use client"
import { useRouter } from 'next/router'
import UserDashboard from './UserDashboard'
import UserAdvertisement from './UserAdvertisement'
import UserProjects from './UserProjects'
import UserFavourites from './UserFavourites'
import UserChat from './UserChat'
import UserProfile from './UserProfile'
import UserPersonalizedFeed from './UserPersonalizedFeed'
import UserNotifications from './UserNotifications'
import UserSubscription from './UserSubscription'
import UserTransactionHistory from './UserTransactionHistory'
import UserVerificationForm from './UserVerificationForm'
import AddProperty from './property/AddProperty'
import EditProperty from './property/EditProperty'
import AddProject from './project/AddProject'
import EditProject from './project/EditProject'
import InterestedUsersTable from './InterestedUsersTable'
import { useState } from 'react'
import PushNotificationLayout from '../wrapper/PushNotificationLayout'
// Import other user components
// Placeholder imports - these need to be created or imported properly

// Root component to render the user dashboard related pages
const UserRoot = ({ notificationData }) => {
    const router = useRouter()
    const { slug = [] } = router.query;

    // Convert slug to array if it's not already
    const slugArray = Array.isArray(slug) ? slug : [slug];

    // Get the main section from the first part of the slug
    const mainSection = slugArray[0];

    // For dynamic routes like edit-property/[propertySlug]
    // we pass the additional parameters to the component
    const params = slugArray.slice(1);


    // Component mapping object for more efficient routing
    const componentMap = {
        "dashboard": UserDashboard,
        "advertisement": UserAdvertisement,
        "projects": UserProjects,
        "favourites": UserFavourites,
        "chat": UserChat,
        "profile": UserProfile,
        "personalize-feed": UserPersonalizedFeed,
        "notifications": UserNotifications,
        "subscription": UserSubscription,
        "transaction-history": UserTransactionHistory,
        "verification-form": UserVerificationForm,
        "add-property": AddProperty,
        "edit-property": EditProperty,
        "add-project": AddProject,
        "edit-project": EditProject,
        "interested": InterestedUsersTable,
    }

    // Get the Component to render based on the main section
    const Component = componentMap[mainSection]

    // Return the component if it exists with any additional params
    // This allows us to pass propertySlug to EditProperty component
    return Component ? <Component params={params} notificationData={notificationData} /> : null
}

export default UserRoot