"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
export function F2WorkflowRunning() {
    const shouldReduceMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    return (<div className="relative bg-[#111111] rounded-[28px] sm:rounded-[32px] lg:rounded-[38px] xl:rounded-[46px] h-[240px] sm:h-[250px] md:h-[270px] lg:h-[295px] xl:h-[320px] overflow-hidden">

        <div className="absolute inset-x-0 top-0 bottom-[80px] sm:bottom-[104px] md:bottom-[112px] lg:bottom-[122px] xl:bottom-[130px] flex items-center justify-center cursor-pointer" onPointerEnter={(e) => {
            if (e.pointerType === 'mouse')
                setIsHovered(true);
        }} onPointerLeave={(e) => {
            if (e.pointerType === 'mouse')
                setIsHovered(false);
        }} onClick={() => setIsHovered(prev => !prev)}>
            <div className="relative translate-y-4 sm:translate-y-0 lg:translate-y-6 xl:translate-y-7 scale-[0.88] sm:scale-[0.78] md:scale-[0.84] lg:scale-[0.88] xl:scale-[0.92]" style={{ width: '230px', height: '180px' }}>

                <div className="absolute left-[10px] top-0 z-[1]">
                    <svg width="214" height="49" viewBox="0 0 200 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[45px] w-[201px]">
                        <g clipPath="url(#f2-top-clip)">
                            <rect width="199.512" height="44.183" rx="20" fill="#1e1e1e" />
                            <path d="M36.204 21.41c0 4.575-3.863 8.285-8.63 8.285-4.765 0-8.629-3.71-8.629-8.285s3.864-8.284 8.63-8.284 8.63 3.709 8.63 8.284" fill="#2d2727" />
                            <rect x="138.078" y="15" width="48" height="15" rx="7.5" fill="#2d2727" />
                            <rect x="48.078" y="15" width="78" height="15" rx="7.5" fill="#2d2727" />
                        </g>
                        <rect x=".5" y=".5" width="198.512" height="43.183" rx="19.5" stroke="url(#f2-top-grad)" />
                        <defs>
                            <linearGradient id="f2-top-grad" x1="0" y1="22.091" x2="199.512" y2="22.091" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#333" />
                                <stop offset="1" stopColor="#999" />
                            </linearGradient>
                            <clipPath id="f2-top-clip">
                                <rect width="199.512" height="44.183" rx="20" fill="#fff" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>


                <motion.div className="absolute left-[10px] top-[45px] sm:top-[48px] z-[2]" animate={shouldReduceMotion ? {} : (isHovered ? { rotate: -5 } : { rotate: 0 })} transition={{
                    duration: 0.15,
                    ease: [0.25, 0.1, 0.25, 1.0]
                }}>
                    <svg width="201" height="45" viewBox="0 0 201 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x=".5" y=".5" width="200" height="42" rx="19.5" fill="#1e1e1e" />
                        <rect x=".5" y=".5" width="200" height="42" rx="19.5" stroke="#8B5CF6" />
                        <path d="M172.394 22.42c.529 0 .958-.411.958-.917 0-.507-.429-.917-.958-.917s-.958.41-.958.917c0 .506.429.916.958.916m0-6.416c.529 0 .958-.41.958-.916 0-.507-.429-.917-.958-.917s-.958.41-.958.917c0 .506.429.916.958.916m0 12.833c.529 0 .958-.41.958-.916 0-.507-.429-.917-.958-.917s-.958.41-.958.917c0 .506.429.916.958.916m5.75-6.416c.529 0 .958-.411.958-.917 0-.507-.429-.917-.958-.917s-.958.41-.958.917c0 .506.429.916.958.916m0-6.416c.529 0 .958-.41.958-.916 0-.507-.429-.917-.958-.917s-.958.41-.958.917c0 .506.429.916.958.916m0 12.833c.529 0 .958-.41.958-.916 0-.507-.429-.917-.958-.917s-.958.41-.958.917c0 .506.429.916.958.916" stroke="#fff" strokeWidth="1.167" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m154.02 24.253-5.75-5.5-5.75 5.5" stroke="#fff" strokeWidth="1.083" strokeLinecap="round" strokeLinejoin="round" />
                        <motion.path d="M39.305 21.788a8.25 8.25 0 1 1-5.701-7.847" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" animate={shouldReduceMotion ? {} : (isHovered ? {
                            rotate: 360,
                        } : {})} transition={{
                            duration: 1.5,
                            ease: "linear",
                            repeat: isHovered ? Infinity : 0,
                        }} style={{
                            transformOrigin: "33.5px 21.5px"
                        }} />
                    </svg>
                    <div className="absolute left-[50px] top-[8px] text-white text-[11px]">
                        Architecture <br/>
                        ready
                    </div>
                </motion.div>


                <div className="absolute left-[10px] top-[90px] sm:top-[96px] z-0">
                    <svg width="201" height="44" viewBox="0 0 201 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#f2-bot-clip)">
                            <rect width="201" height="44" rx="20" fill="#1e1e1e" />
                            <path d="M36.474 21.322c0 4.557-3.893 8.25-8.694 8.25s-8.694-3.693-8.694-8.25c0-4.556 3.892-8.25 8.694-8.25 4.801 0 8.694 3.694 8.694 8.25" fill="#2d2727" />
                            <rect x="138.078" y="15" width="48" height="15" rx="7.5" fill="#2d2727" />
                            <rect x="48.078" y="15" width="78" height="15" rx="7.5" fill="#2d2727" />
                        </g>
                        <rect x=".5" y=".5" width="200" height="43" rx="19.5" stroke="url(#f2-bot-grad)" />
                        <defs>
                            <linearGradient id="f2-bot-grad" x1="0" y1="22" x2="201" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#333" />
                                <stop offset="1" stopColor="#999" />
                            </linearGradient>
                            <clipPath id="f2-bot-clip">
                                <rect width="201" height="44" rx="20" fill="#fff" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>


                <motion.div className="absolute left-[182px] top-[73px] sm:top-[76px] z-10" animate={shouldReduceMotion ? {} : (isHovered ? {
                    y: 2,
                    scale: 0.95
                } : {
                    y: 0,
                    scale: 1
                })} transition={{
                    duration: 0.1,
                    ease: [0.25, 0.1, 0.25, 1.0]
                }}>
                    <svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="f2-cursor-a" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="41" height="42">
                            <path d="M40.367 0H0v41.351h40.367z" fill="#fff" />
                        </mask>
                        <g mask="url(#f2-cursor-a)">
                            <path d="M14.256 26.362c-.379-.517-.757-1.422-1.514-2.585-.379-.646-1.514-1.938-1.892-2.455-.253-.517-.253-.775-.127-1.292.127-.776.883-1.422 1.766-1.422.631 0 1.262.517 1.767.905.252.258.63.775.883 1.034.252.258.252.387.504.646.252.387.379.646.252.129-.126-.646-.252-1.68-.504-2.714-.126-.775-.252-.904-.379-1.421-.126-.646-.252-1.034-.378-1.68-.126-.388-.252-1.422-.378-1.938-.127-.647-.127-1.81.378-2.327.378-.387 1.135-.516 1.64-.258.63.388 1.01 1.292 1.135 1.68.253.646.505 1.55.631 2.584.252 1.293.63 3.231.63 3.619 0-.517-.126-1.422 0-1.939.127-.387.38-.904.884-1.033.378-.13.757-.13 1.135-.13.378.13.757.388 1.01.646.504.776.504 2.456.504 2.326.126-.516.126-1.55.378-2.067.126-.259.631-.517.883-.646a2.1 2.1 0 0 1 1.262 0c.252 0 .757.387.883.646.252.387.378 1.68.504 2.197 0 .129.127-.517.379-.905.504-.775 2.27-1.034 2.396.775v2.972c0 .518-.126 1.68-.252 2.197-.126.388-.504 1.293-.883 1.81 0 0-1.387 1.55-1.514 2.325-.126.776-.126.776-.126 1.293s.127 1.163.127 1.163-1.01.129-1.514 0c-.505-.13-1.136-1.034-1.262-1.422-.252-.387-.63-.387-.883 0-.252.517-.883 1.422-1.387 1.422-.883.129-2.65 0-3.91 0 0 0 .251-1.293-.253-1.81l-1.388-1.42z" fill="#fff" />
                        </g>
                        <mask id="f2-cursor-b" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="41" height="42">
                            <path d="M40.367 0H0v41.351h40.367z" fill="#fff" />
                        </mask>
                        <g mask="url(#f2-cursor-b)">
                            <path d="M14.256 26.362c-.379-.517-.757-1.422-1.514-2.585-.379-.646-1.514-1.938-1.892-2.455-.253-.517-.253-.775-.127-1.292.127-.776.883-1.422 1.766-1.422.631 0 1.262.517 1.767.905.252.258.63.775.883 1.034.252.258.252.387.504.646.252.387.379.646.252.129-.126-.646-.252-1.68-.504-2.714-.126-.775-.252-.904-.379-1.421-.126-.646-.252-1.034-.378-1.68-.126-.388-.252-1.422-.378-1.938-.127-.647-.127-1.81.378-2.327.378-.387 1.135-.516 1.64-.258.63.388 1.01 1.292 1.135 1.68.253.646.505 1.55.631 2.584.252 1.293.63 3.231.63 3.619 0-.517-.126-1.422 0-1.939.127-.387.38-.904.884-1.033.378-.13.757-.13 1.135-.13.378.13.757.388 1.01.646.504.776.504 2.456.504 2.326.126-.516.126-1.55.378-2.067.126-.259.631-.517.883-.646a2.1 2.1 0 0 1 1.262 0c.252 0 .757.387.883.646.252.387.378 1.68.504 2.197 0 .129.127-.517.379-.905.504-.775 2.27-1.034 2.396.775v2.972c0 .518-.126 1.68-.252 2.197-.126.388-.504 1.293-.883 1.81 0 0-1.387 1.55-1.514 2.325-.126.776-.126.776-.126 1.293s.127 1.163.127 1.163-1.01.129-1.514 0c-.505-.13-1.136-1.034-1.262-1.422-.252-.387-.63-.387-.883 0-.252.517-.883 1.422-1.387 1.422-.883.129-2.65 0-3.91 0 0 0 .251-1.293-.253-1.81l-1.388-1.42z" stroke="#000" strokeWidth=".75" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <mask id="f2-cursor-c" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="41" height="42">
                            <path d="M40.367 0H0v41.351h40.367z" fill="#fff" />
                        </mask>
                        <g mask="url(#f2-cursor-c)">
                            <path d="M24.725 26.749v-4.393" stroke="#000" strokeWidth=".75" strokeLinecap="round" />
                        </g>
                        <mask id="f2-cursor-d" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="41" height="42">
                            <path d="M40.367 0H0v41.351h40.367z" fill="#fff" />
                        </mask>
                        <g mask="url(#f2-cursor-d)">
                            <path d="m22.204 26.749-.126-4.393" stroke="#000" strokeWidth=".75" strokeLinecap="round" />
                        </g>
                        <mask id="f2-cursor-e" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="41" height="42">
                            <path d="M40.367 0H0v41.351h40.367z" fill="#fff" />
                        </mask>
                        <g mask="url(#f2-cursor-e)">
                            <path d="M19.68 22.356v4.393" stroke="#000" strokeWidth=".75" strokeLinecap="round" />
                        </g>
                    </svg>
                </motion.div>
            </div>
        </div>


        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 sm:px-6 lg:px-7 xl:px-8 pb-4 sm:pb-5 lg:pb-6 bg-gradient-to-t from-[#111111] via-[#111111] to-transparent pt-8 sm:pt-9 lg:pt-10">
            <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] leading-[24px] sm:leading-[26px] lg:leading-[28px] xl:leading-[30px] text-white font-normal">
                Automated System Design
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-[#7D7D87] leading-[18px] sm:leading-[20px] lg:leading-[22px]">
                Instantly generate scalable system architecture for edge AI applications.
            </p>
        </div>
    </div>);
}