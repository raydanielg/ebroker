import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { useTranslation } from '../context/TranslationContext';
import VerifiedIcon from '@/assets/verified.svg';
import Image from 'next/image';
import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { FaX } from 'react-icons/fa6';
import Link from 'next/link';
import CustomLink from '../context/CustomLink';
import React from 'react';

const getIcon = (iconName) => {
    switch (iconName) {
        case 'facebook':
            return <FaFacebookF className='w-5 h-5' />;
        case 'instagram':
            return <AiFillInstagram className='w-5 h-5' />;
        case 'twitter':
            return <FaX className='w-5 h-5' />;
        case 'youtube':
            return <FaYoutube className='w-5 h-5' />;
        default:
            return "";
    }
};

const AgentProfileCard = ({ agent }) => {
    const t = useTranslation();

    const socialMediaLinks = [
        { name: "Facebook", icon: "facebook", url: agent?.facebook_id },
        { name: "Instagram", icon: "instagram", url: agent?.instagram_id },
        { name: "Twitter", icon: "twitter", url: agent?.twitter_id },
        { name: "YouTube", icon: "youtube", url: agent?.youtube_id },
    ];
    const hasAtLeastOneSocialLink = socialMediaLinks.some(link => !!link.url);

    return (
        <CustomLink
            href={`/agent-details/${agent.slug_id}${agent?.is_admin ? "?is_admin=true" : ""}`}
            className="w-full h-full"
        >
            <div className={'w-full md:w-full bg-white group rounded-2xl border cardBorder'}>
                {/* Image section with social icons */}
                <div className="relative px-4 md:px-4 pt-4 w-full h-[250px] overflow-hidden rounded-t-2xl">
                    <ImageWithPlaceholder
                        src={agent?.profile}
                        alt={agent?.name || "Agent Profile"}
                        className="w-full h-full rounded-lg object-fill group-hover:brightness-[0.8]"
                        priority={false}
                    />

                    {/* Verified badge */}
                    {
                        agent?.is_verified && (
                            <div className="absolute top-6 left-6 bg-white text-black text-sm font-medium rounded-md px-2 py-1 flex items-center gap-1 z-10">
                                <Image src={VerifiedIcon} alt="Verified" className='w-full h-full' width={0} height={0} />
                                {t("verified")}
                            </div>
                        )
                    }

                    {/* Social Media icons from behind */}
                    {hasAtLeastOneSocialLink && (
                        <div className="absolute left-4 right-4 bottom-[-40px] group-hover:bottom-0 opacity-0 group-hover:opacity-100 bg-black rounded-b-lg h-10 flex items-center justify-around gap-2 px-2 transition-all duration-500 ease-in-out z-20">
                            {socialMediaLinks.map((link, idx) => {
                                if (!link.url) return null;
                                return (
                                    <React.Fragment key={link.name}>
                                        <Link
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            rel="noopener noreferrer"
                                            className="text-white transition-transform duration-300"
                                        >
                                            {getIcon(link.icon)}
                                        </Link>
                                        {idx !== socialMediaLinks.length - 1 && <span className='border-l leadBorderColor h-4' />}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div >

                {/* Agent info */}
                <div className="p-4 lg:p-3" >
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{agent?.name}</h3>
                    <p className="mb-4 truncate text-sm text-gray-500">{agent?.email}</p>

                    <div className="flex flex-col items-center justify-evenly gap-2 border border-gray-100 rounded-lg p-3 xl:p-2 primaryBackgroundBg">
                        <div className="text-center flex items-center justify-center">
                            <p className="text-base font-medium leadColor">{t("properties")}:</p>
                            <p className="text-base font-medium leadColor ml-1">{agent?.property_count}</p>
                        </div>
                        <div className='w-full h-[0.5px] newBorder' />
                        <div className="text-center flex items-center justify-center">
                            <p className="text-base font-medium leadColor">{t("projects")}:</p>
                            <p className="text-base font-medium leadColor ml-1">{agent?.projects_count}</p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomLink>
    );
};

export default AgentProfileCard;
