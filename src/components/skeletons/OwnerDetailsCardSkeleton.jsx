import { Skeleton } from "@/components/ui/skeleton";

const OwnerDetailsCardSkeleton = () => {
    return (
        <div className="cardBg border mb-6 flex flex-col rounded-lg w-full">
            {/* Header section with profile image and user info */}
            <div className="blackTextColor border-b p-3 sm:p-4 md:p-5 text-base font-extrabold">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 md:gap-6">
                    {/* Profile image */}
                    <div className="rounded-sm border-[3px] p-1 flex-shrink-0">
                        <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded" />
                    </div>

                    {/* User details */}
                    <div className="blackTextColor flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1 flex-wrap">
                            <Skeleton className="h-5 sm:h-6 w-24 sm:w-28" /> {/* Name */}
                            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" /> {/* Verified badge */}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded" /> {/* Social icon 1 */}
                            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded" /> {/* Social icon 2 */}
                            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded" /> {/* Social icon 3 */}
                        </div>
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-4 w-4 rounded flex-shrink-0" /> {/* Email icon */}
                            <Skeleton className="h-3 w-28 sm:w-32 text-xs" /> {/* Email */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact section */}
            <div className="p-3 sm:p-4 md:p-5">
                <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
                    {/* Phone number */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="blueBorder blueBgLight flex h-10 w-10 sm:h-12 sm:w-12 rounded border-[0.5px] p-2 sm:p-3 flex-shrink-0">
                            <Skeleton className="h-6 w-6" /> {/* Phone icon */}
                        </div>
                        <div className="flex flex-col text-xs sm:text-sm">
                            <Skeleton className="h-4 sm:h-5 w-14 sm:w-16 mb-1" /> {/* "Call" text */}
                            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" /> {/* Phone number */}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="greenBorder greenBgLight flex h-10 w-10 sm:h-12 sm:w-12 rounded border-[0.5px] p-2 sm:p-3 flex-shrink-0 mt-0.5">
                            <Skeleton className="h-6 w-6" /> {/* Location icon */}
                        </div>
                        <div className="flex flex-col text-xs sm:text-sm">
                            <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 mb-1" /> {/* "Location" text */}
                            <Skeleton className="h-3 sm:h-4 w-32 sm:w-40" /> {/* Address */}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="orangeBorder orangeBgLight flex h-10 w-10 sm:h-12 sm:w-12 rounded border-[0.5px] p-2 sm:p-3 flex-shrink-0">
                            <Skeleton className="h-6 w-6" /> {/* Chat icon */}
                        </div>
                        <div className="flex flex-col text-xs sm:text-sm">
                            <Skeleton className="h-4 sm:h-5 w-14 sm:w-16 mb-1" /> {/* "Chat" text */}
                            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" /> {/* "Start Chat" text */}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between gap-3 sm:gap-4 w-full">
                        <Skeleton className="h-9 sm:h-10 w-full xl:w-1/2 rounded-md" /> {/* Report button */}
                        <Skeleton className="h-9 sm:h-10 w-full xl:w-1/2 rounded-md" /> {/* Interest button */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDetailsCardSkeleton; 