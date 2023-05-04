import Image from "next/image";


export default function InstagramCarousel() {
    return (
        <div className="flex flex-col items-center justify-center shadow-lg font-[-apple-system,BlinkMacSystemFont,SegoeUI,Roboto,Helvetica,Arial,sans-serif]">
            <div className="flex justify-between w-full p-3 bg-white rounded-t-lg">
                <div className="flex items-center">
                    <div className="flex justify-center items-center relative w-8 h-8">
                        <Image className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="/277986527_432783865283666_92851521188512010_n.jpg" alt="morelito" width={28} height={28} loader={({ src }) => {
                            return src
                        }}
                            unoptimized />
                        <Image className="absolute scale-150 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="/stroke.png" alt="ig-ring" width={21} height={21} loader={({ src }) => {
                            return src
                        }}
                            unoptimized />
                    </div>
                    <div className="flex ml-3 items-center h-full">
                        <h2>
                            loft.35
                        </h2>
                    </div>
                </div>
                <div className="flex items-center">
                    <svg aria-label="More options" className="_ab6-" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
                </div>
            </div>

            <div className="carousel relative min-w-[300px] h-auto">
                <div className="w-full pb-[140%]" ></div>
                <div className="carousel-item relative h-full w-full">
                    <Image src="/339997063_235581592360952_5520683447546139236_n.jpg" fill loader={({ src }) => {
                        return src
                    }}
                        unoptimized className="w-full object-cover" alt="Tailwind CSS Carousel component" />
                </div>
                <div className="carousel-item relative h-full w-full">
                    <Image src="/340520251_765836468395090_670409969989095455_n.jpg" fill loader={({ src }) => {
                        return src
                    }}
                        unoptimized className="w-full object-cover" alt="Tailwind CSS Carousel component" />
                </div>
                <div className="carousel-item relative h-full w-full">
                    <Image src="/343440829_210798974997231_9015254215868255261_n.jpg" fill loader={({ src }) => {
                        return src
                    }}
                        unoptimized className="w-full object-cover" alt="Tailwind CSS Carousel component" />
                </div>
            </div>
            <div className="flex flex-col w-full bg-white rounded-b-lg">
                <div className="flex justify-between w-full p-3 bg-white">
                    <div className="flex">
                        <svg aria-label="Like" className="mr-3" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path><svg aria-label="Like" className="x1lliihq x1n2onr6" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg></svg>
                        <svg aria-label="Comment" className="mr-3" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                        <svg aria-label="Share Post" className="mr-3" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                    </div>
                    <div className="flex">
                        <svg aria-label="Save" className="x1lliihq x1n2onr6" color="rgb(0, 0, 0)" fill="rgb(0, 0, 0)" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                    </div>
                </div>
                <div className="pl-3 w-full flex">
                    <div className="relative h-5 w-9 ">
                        <Image
                            className="rounded-full absolute z-10 left-0"
                            src="/337377298_597071488987989_1925932562573866422_n.jpg"
                            alt="morelito"
                            width={20}
                            height={20}
                            loader={({ src }) => {
                                return src
                            }}
                            unoptimized
                        />
                        <Image
                            className="rounded-full absolute right-0"
                            src="/328316511_1875642766103782_568815812536931801_n.jpg"
                            alt="morelito"
                            width={20}
                            height={20}
                            loader={({ src }) => {
                                return src
                            }}
                            unoptimized
                        />
                    </div>
                    <div className="h-full flex items-center">
                        <h2 className="font-medium text-xs ml-1">
                            Liked by <span className="font-semibold">ch_morell42</span> and <span className="font-bold">others</span>
                        </h2>
                    </div>
                </div>
                <div className="pl-3 pt-2 w-full pb-3 flex">
                    <h2 className="text-[10px] text-[#737373]">APRIL 2</h2>
                </div>
            </div>
        </div>
    );
}