import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import PropertyVerticalNewCard from "../cards/PropertyVerticalNewCard";
import { getAgentPropertiesApi } from "@/api/apiRoutes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCardSkeleton from "../skeletons/PropertyCardSkeleton";
import ProjectCardSkeleton from "../skeletons/ProjectCardSkeleton";
import AgentHorizontalCardSkeleton from "../skeletons/AgentHorizontalCardSkeleton";
import UnlockPremiumPropertyCardSkeleton from "../skeletons/UnlockPremiumPropertyCardSkeleton";
import AboutAgentSkeleton from "../skeletons/AboutAgentSkeleton";
import ProjectCardWithSwiperNew from "../cards/ProjectCardWithSwiperNew";
import Link from "next/link";
import { HiMiniSlash } from "react-icons/hi2";
import CustomLink from "../context/CustomLink";
import { LuShare2 } from "react-icons/lu";
import AgentHorizontalCard from "../cards/AgentHorizontalCard";
import UnlockPremiumPropertyCard from "../cards/UnlockPremiumPropertyCard";
import ShareDialog from "../reusable-components/ShareDialog";
import { useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomSheet from "../mobile-bottom-sheet/MobileBottomSheet";
import NewBreadcrumb from "../breadcrumb/NewBreadCrumb";

const AgentDetails = () => {
  const t = useTranslation();
  const router = useRouter();
  const { slug, locale } = router?.query;

  // Tab state management - default to about agent
  const [selectedTab, setSelectedTab] = useState(
    router?.query?.is_admin === "true" ? "properties" : "about",
  );
  const userData = useSelector((state) => state?.User?.data);
  const language = useSelector((state) => state.LanguageSettings?.active_language);

  // Agent data state
  const [agentDetails, setAgentDetails] = useState(null);
  const [isAgentLoading, setIsAgentLoading] = useState(true);
  const [error, setError] = useState(null);

  // Properties state
  const [properties, setProperties] = useState([]);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(false);
  const [propertiesOffset, setPropertiesOffset] = useState(0);
  const [propertiesTotal, setPropertiesTotal] = useState(0);
  const [loadingMoreProperties, setLoadingMoreProperties] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [projectsOffset, setProjectsOffset] = useState(0);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [loadingMoreProjects, setLoadingMoreProjects] = useState(false);

  const [isFeatureAvailable, setIsFeatureAvailable] = useState(false);
  const [premiumPropertiesCount, setPremiumPropertiesCount] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Configuration - Separate limits for properties and projects
  const propertiesLimit = 8; // Limit for properties tab
  const projectsLimit = 6;   // Limit for projects tab
  const [isExpanded, setIsExpanded] = useState(false);

  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/agent-details/${agentDetails?.slug_id}${router?.query?.is_admin === "true" ? "?is_admin=true&share=true" : "?share=true"}`;


  const isMobile = useIsMobile();
  const isShare = router?.query?.share === "true";
  // Fetch agent basic data on component mount
  const fetchAgentBasicData = async () => {
    try {
      if (!slug) return;

      setIsAgentLoading(true);
      const res = await getAgentPropertiesApi({
        slug_id: slug,
        is_projects: "",
        is_admin: router?.query?.is_admin === "true" ? "1" : "",
        limit: propertiesLimit.toString(),
        offset: "0",
      });

      if (!res.error && res.data?.customer_data) {
        setAgentDetails(res.data.customer_data);
        setIsFeatureAvailable(res.data.feature_available);
        setPremiumPropertiesCount(res.data.premium_properties_count);
      } else {
        setError(res.message || "Failed to load agent data");
      }
    } catch (error) {
      console.error("Error fetching agent basic data:", error);
      setError("Failed to load agent data");
    } finally {
      setIsAgentLoading(false);
    }
  };

  // Fetch properties data
  const fetchPropertiesData = async (
    isLoadMore = false,
    offsetOverride = null,
  ) => {
    try {
      if (!slug) return;

      if (!isLoadMore) {
        setIsPropertiesLoading(true);
        setPropertiesOffset(0);
      } else {
        setLoadingMoreProperties(true);
      }

      // Use offsetOverride if provided, otherwise use current offset logic
      const currentOffset =
        offsetOverride !== null
          ? offsetOverride
          : isLoadMore
            ? propertiesOffset
            : 0;

      const res = await getAgentPropertiesApi({
        slug_id: slug,
        is_projects: "",
        is_admin: router?.query?.is_admin === "true" ? "1" : "",
        limit: propertiesLimit.toString(),
        offset: currentOffset.toString(),
      });

      if (!res.error) {
        const newProperties = res.data?.properties_data || [];

        if (isLoadMore) {
          setProperties((prev) => [...prev, ...newProperties]);
        } else {
          setProperties(newProperties);
        }

        setPropertiesTotal(res.total || 0);

        // Update agent details if not already loaded
        if (!agentDetails && res.data?.customer_data) {
          setAgentDetails(res.data.customer_data);
        }
      } else {
        setError(res.message || "Failed to load properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to load properties");
    } finally {
      setIsPropertiesLoading(false);
      setLoadingMoreProperties(false);
    }
  };

  // Fetch projects data
  const fetchProjectsData = async (
    isLoadMore = false,
    offsetOverride = null,
  ) => {
    try {
      if (!slug) return;

      if (!isLoadMore) {
        setIsProjectsLoading(true);
        setProjectsOffset(0);
      } else {
        setLoadingMoreProjects(true);
      }

      // Use offsetOverride if provided, otherwise use current offset logic
      const currentOffset =
        offsetOverride !== null
          ? offsetOverride
          : isLoadMore
            ? projectsOffset
            : 0;

      const res = await getAgentPropertiesApi({
        slug_id: slug,
        is_projects: "1",
        limit: projectsLimit.toString(),
        is_admin: router?.query?.is_admin === "true" ? "1" : "",
        offset: currentOffset.toString(),
      });

      if (!res.error) {
        const newProjects = res.data?.projects_data || [];

        if (isLoadMore) {
          setProjects((prev) => [...prev, ...newProjects]);
        } else {
          setProjects(newProjects);
        }

        setProjectsTotal(res.total || 0);

        // Update agent details if not already loaded
        if (!agentDetails && res.data?.customer_data) {
          setAgentDetails(res.data.customer_data);
        }
      } else {
        setError(res.message || "Failed to load projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setIsProjectsLoading(false);
      setLoadingMoreProjects(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (router?.query?.is_admin === "true") {
      fetchAgentBasicData();
      fetchPropertiesData();
      return;
    }
    if (slug) {
      fetchAgentBasicData();
    }
    return () => {
      fetchPropertiesData();
      fetchProjectsData();
    };
  }, [slug, userData, language]);

  // Handle tab change with data fetching
  const handleTabChange = (value) => {
    setSelectedTab(value);

    if (value === "properties" && properties.length === 0) {
      fetchPropertiesData();
    } else if (value === "projects" && projects.length === 0) {
      fetchProjectsData();
    }
  };

  // Handle load more for properties
  const handleLoadMoreProperties = () => {
    const newOffset = propertiesOffset + propertiesLimit;
    fetchPropertiesData(true, newOffset);
    setPropertiesOffset(newOffset);
  };

  // Handle load more for projects
  const handleLoadMoreProjects = () => {
    const newOffset = projectsOffset + projectsLimit;
    fetchProjectsData(true, newOffset);
    setProjectsOffset(newOffset);
  };

  // Calculate if more data is available
  const hasMoreProperties = properties.length < propertiesTotal;
  const hasMoreProjects = projects.length < projectsTotal;
  const PropertiesSoldCount = agentDetails?.properties_sold_count;
  const PropertiesRentCount = agentDetails?.properties_rented_count;

  return (
    <div className="min-h-screen bg-background">
      <div className="primaryBackgroundBg">
        <div className="container mx-auto px-4 pb-5 sm:px-4 sm:pb-8">
          <NewBreadcrumb
            items={[
              { label: t("allAgents"), href: `/all/agents` },
              { label: t("agentDetails"), href: `/agent-details/${slug}` },
            ]}
            layout="reverse"
            showLike={false}
            setIsShareModalOpen={setIsShareModalOpen}
          />
          <div
            className={`grid grid-cols-12 gap-3 ${premiumPropertiesCount > 0 && !isFeatureAvailable ? "" : "mx-auto justify-center"}`}
          >
            {/* Breadcrumb */}

            {/* Agent Card */}
            <div
              className={`col-span-12 ${premiumPropertiesCount > 0 && !isFeatureAvailable && (selectedTab === "properties" || selectedTab === "about") ? "lg:col-span-9" : "lg:col-span-12"} `}
            >
              {isAgentLoading ? (
                <AgentHorizontalCardSkeleton />
              ) : agentDetails ? (
                <AgentHorizontalCard
                  agentDetails={agentDetails}
                  isFeatureAvailable={isFeatureAvailable}
                />
              ) : (
                <div className="rounded-lg border bg-white p-6 text-center">
                  <p className="text-gray-500">{t("agentNotFound")}</p>
                </div>
              )}
            </div>
            {premiumPropertiesCount > 0 &&
              !isFeatureAvailable &&
              (selectedTab === "properties" || selectedTab === "about") && (
                <div className="col-span-12 lg:col-span-3">
                  {isAgentLoading ? (
                    <UnlockPremiumPropertyCardSkeleton />
                  ) : (
                    <UnlockPremiumPropertyCard count={premiumPropertiesCount} />
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-3 py-5 sm:px-4 sm:py-8">
        <div className="grid grid-cols-12 gap-3 sm:gap-6">
          {/* Main Content - Tabs */}
          <div className="col-span-12">
            <Tabs
              value={selectedTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              {/* Tab Header */}
              <div className="mb-6 flex flex-col md:flex-row h-fit items-center gap-3 justify-between rounded-lg border bg-white p-2 md:p-4 xl:items-center">
                <TabsList className="grid h-full grid-cols-3 items-center rounded-lg bg-muted/50 bg-white xl:flex xl:w-auto">
                  {router?.query?.is_admin !== "true" && (
                    <TabsTrigger
                      value="about"
                      className="data-[state=active]:brandBg data-[state=active]:primaryTextColor bg-white p-3 text-base text-wrap font-medium transition-all duration-200 hover:text-foreground xl:flex-none"
                    >
                      {t("about")} {t("agent")}
                    </TabsTrigger>
                  )}
                  <TabsTrigger
                    value="properties"
                    className="data-[state=active]:brandBg data-[state=active]:primaryTextColor bg-white p-3 text-base text-wrap font-medium transition-all duration-200 hover:text-foreground xl:flex-none"
                  >
                    {t("properties")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:brandBg data-[state=active]:primaryTextColor bg-white p-3 text-base text-wrap font-medium transition-all duration-200 hover:text-foreground xl:flex-none"
                  >
                    {t("projects")}
                  </TabsTrigger>
                </TabsList>

                {(PropertiesSoldCount > 0 || PropertiesRentCount > 0) && (
                  <div className="primaryBackgroundBg secondryTextColor flex flex-wrap md:flex-nowrap text-sm items-center justify-center gap-2 text-justify font-semibold sm:text-base xl:text-right px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-3 rounded-lg">
                    {PropertiesSoldCount > 0 && (
                      <span className=" text-nowrap font-medium text-sm md:text-base leadColor">
                        {t("propertySold")} : <span className="font-bold brandColor">{PropertiesSoldCount}</span>
                      </span>
                    )}
                    {PropertiesRentCount > 0 && (
                      <span className="h-6 w-[1.5px] rounded-full newBorder xl:block" />
                    )}
                    {PropertiesRentCount > 0 && (
                      <span className=" text-nowrap font-medium text-sm md:text-base leadColor">
                        {t("propertyRented")} : <span className="font-bold brandColor">{PropertiesRentCount}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Results Count - Only show for properties and projects */}
                {/* {(selectedTab === "properties" ||
                  selectedTab === "projects") && (
                    <div className="secondryTextColor text-center text-sm font-semibold sm:text-base xl:text-right">
                      {selectedTab === "properties" ? (
                        <span>
                          {propertiesTotal} {t("properties")} {t("found")}
                        </span>
                      ) : (
                        <span>
                          {projectsTotal} {t("projects")} {t("found")}
                        </span>
                      )}
                    </div>
                  )} */}
              </div>
              {/* About Agent Tab Content */}
              {router?.query?.is_admin !== "true" && (
                <TabsContent value="about" className="mt-0 space-y-6">
                  {isAgentLoading ? (
                    <AboutAgentSkeleton />
                  ) : agentDetails?.about_me ? (
                    <div className="cardBorder rounded-lg border bg-white md:rounded-2xl">
                      <div className="brandColor border-b p-3 text-base md:text-xl font-bold sm:p-6">
                        {t("about")} {t("agent")}
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="leadColor text-sm font-medium md:text-base">
                          {agentDetails?.about_me}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border bg-white py-12 text-center shadow-sm sm:py-16">
                      <div className="mx-auto max-w-md">
                        <p className="mb-2 text-base text-muted-foreground sm:text-lg">
                          {t("noAboutInfoAvailable")}
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                          {t("contactAgentForMoreInfo")}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Properties Tab Content */}
              <TabsContent value="properties" className="mt-0 space-y-6">
                {isPropertiesLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {[...Array(6)].map((_, index) => (
                      <PropertyCardSkeleton key={index} />
                    ))}
                  </div>
                ) : properties && properties.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 place-items-center gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
                      {properties.map((property) => (
                        <PropertyVerticalNewCard
                          key={property.id}
                          property={property}
                        />
                      ))}
                    </div>

                    {/* Load More Properties */}
                    {hasMoreProperties && (
                      <div className="flex justify-center pt-4">
                        {loadingMoreProperties ? (
                          <div className="custom-loader"></div>
                        ) : (
                          <button
                            onClick={handleLoadMoreProperties}
                            className="brandColor brandBorder hover:primaryBg hover:primaryTextColor hover:text-white hover:border-transparent rounded-lg border bg-transparent px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                          >
                            {t("loadMore")} {t("listing")}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border bg-white py-12 text-center shadow-sm sm:py-16">
                    <div className="mx-auto max-w-md">
                      <p className="mb-2 text-base text-muted-foreground sm:text-lg">
                        {t("noPropertiesFound")}
                      </p>
                      {/* <p className="text-sm text-muted-foreground/80">
                        {t("checkBackLater")}
                      </p> */}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Proects Tab Cojntent */}
              <TabsContent value="projects" className="mt-0 space-y-6">
                { }
                {isProjectsLoading ? (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[...Array(6)].map((_, index) => (
                      <ProjectCardSkeleton key={index} />
                    ))}
                  </div>
                ) : !isProjectsLoading &&
                  premiumPropertiesCount > 0 &&
                  !isFeatureAvailable ? (
                  <div className="rounded-lg border bg-white py-12 text-center shadow-sm sm:py-16">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="brandColor text-2xl font-bold">
                        {t("unlockPremiumProjects")}
                      </div>
                      <div className="leadColor text-base font-medium">
                        {t("thisAgentHas")} {projectsTotal}{" "}
                        {t("exclusivePremiumListingsAvailable")}
                      </div>
                      <div>
                        <button className="brandBg primaryTextColor rounded-lg border bg-transparent px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                          onClick={() => router.push(`/${locale}/subscription-plan`)}
                        >
                          {t("subscribeNow")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : projects && projects.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {projects.map((project) => (
                        <ProjectCardWithSwiperNew
                          key={project.id}
                          data={project}
                        />
                      ))}
                    </div>

                    {/* Load More Projects */}
                    {hasMoreProjects && (
                      <div className="flex justify-center pt-4">
                        {loadingMoreProjects ? (
                          <div className="custom-loader"></div>
                        ) : (
                          <button
                            onClick={handleLoadMoreProjects}
                            className="primaryColor primaryBorderColor hover:primaryBg hover:primaryTextColor rounded-lg border bg-transparent px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                          >
                            {t("loadMore")} {t("projects")}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : !isProjectsLoading && projectsTotal > 0 && !isFeatureAvailable ? (
                  <div className="rounded-lg border bg-white py-12 text-center shadow-sm sm:py-16">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="brandColor text-2xl font-bold">
                        {t("unlockPremiumProjects")}
                      </div>
                      <div className="leadColor text-base font-medium">
                        {t("thisAgentHas")} {projectsTotal}{" "}
                        {t("exclusivePremiumListingsAvailable")}
                      </div>
                      <div>
                        <button className="brandBg primaryTextColor rounded-lg border bg-transparent px-6 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-base"
                          onClick={() => router.push(`/${locale}/subscription-plan`)}
                        >
                          {t("subscribeNow")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) :
                  (
                    <div className="rounded-lg border bg-white py-12 text-center shadow-sm sm:py-16">
                      <div className="mx-auto max-w-md">
                        <p className="mb-2 text-base text-muted-foreground sm:text-lg">
                          {t("noProjectsFound")}
                        </p>
                      </div>
                    </div>
                  )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <ShareDialog
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          title={t("shareAgentDetails")}
          subtitle={t("shareAgentDetailsSubtitle")}
          pageUrl={currentUrl}
        />
      )}
      {isMobile && isShare && <MobileBottomSheet isShare={true} />}
    </div>
  );
};

export default AgentDetails;
