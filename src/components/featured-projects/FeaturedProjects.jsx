"use client"
import { useEffect, useState } from 'react'
import { getAllProjectsApi } from '@/api/apiRoutes'
import NoDataFound from '../no-data-found/NoDataFound'
import { useTranslation } from '../context/TranslationContext'
import ProjectCardWithSwiperNew from '../cards/ProjectCardWithSwiperNew'
import NewBreadcrumb from '../breadcrumb/NewBreadCrumb'
import { NewBreadcrumbSkeleton, ProjectCardSkeleton } from '../skeletons'
import { useSelector } from 'react-redux'

const FeaturedProjects = () => {
    const t = useTranslation()
    const language = useSelector((state) => state.LanguageSettings?.active_language);
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [error, setError] = useState(null)
    const [offset, setOffset] = useState(0)
    const limit = 8
    const [hasMore, setHasMore] = useState(true)

    const fetchProjects = async (currentOffset = 0) => {
        setLoading(true)
        try {
            const response = await getAllProjectsApi({
                limit: limit.toString(),
                offset: currentOffset.toString(),
                get_featured: "1"
            })

            if (response && response.data) {
                if (currentOffset === 0) {
                    setProjects(response.data)
                } else {
                    setProjects(prevProjects => [...prevProjects, ...response.data])
                }
                setHasMore(response.data.length + currentOffset < response.total)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            setError(error)
            console.error("Error fetching featured projects:", error)
        } finally {
            setLoading(false)
            setIsInitialLoading(false)
        }
    }

    const handleLoadMore = () => {
        const newOffset = offset + limit
        setOffset(newOffset)
        fetchProjects(newOffset)
    }

    useEffect(() => {
        fetchProjects(0)
    }, [language])

    // Initial loading state
    if (isInitialLoading) {
        return (
            <div>
                <NewBreadcrumbSkeleton />
                <div className='container mx-auto py-10 px-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {[...Array(limit)].map((_, index) => (
                            <ProjectCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // No projects found state
    if (!loading && projects.length === 0) {
        return (
            <div>
                <NewBreadcrumb title={t("featuredProjects")} items={[{ href: "/projects/featured-projects", label: t("featuredProjects") }]} />
                <div className='container mx-auto py-10 px-2'>
                    <NoDataFound />
                </div>
            </div>
        )
    }

    // Projects loaded state
    return (
        <div>
            <NewBreadcrumb title={t("featuredProjects")} items={[{ href: "/projects/featured-projects", label: t("featuredProjects") }]} />
            <div className='container mx-auto py-10 px-2'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {projects.map((project) => (
                        <ProjectCardWithSwiperNew key={project.id} data={project} />
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    {loading && !isInitialLoading && (
                        <div className="my-10 flex items-center justify-center">
                            <div className="custom-loader"></div>
                        </div>
                    )}

                    {!loading && hasMore && (
                        <div className="mt-5 flex w-full items-center justify-center text-center">
                            <button
                                className="primaryText primaryColor primaryBorderColor my-5 rounded-lg border bg-transparent px-4 py-2"
                                onClick={handleLoadMore}
                            >
                                {t("loadMore")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FeaturedProjects