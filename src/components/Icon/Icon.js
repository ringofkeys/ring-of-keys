import React from "react"

export default function Icon({ type, className, fill = "white" }) {
    switch (type) {
        case "close":
            return (
                <svg viewBox='0 0 5 5' fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d='M 1 1 l 3 3' stroke={fill} stroke-linecap='round'/>
                    <path d='M 1 4 l 3 -3' stroke={fill} stroke-linecap='round'/>
                </svg>
            )
        case "camera":
            return (
                <svg
                    viewBox="0 0 64 44"
                    fill="none"
                    className={className}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path fillRule="evenodd" clipRule="evenodd" d="M30 1.75H22.5111C21.5722 1.75 20.6791 2.15605 20.0619 2.8636L19.3124 3.72286C18.0305 5.19238 16.1758 6.03572 14.2257 6.03572H10C8.20507 6.03572 6.75 7.49079 6.75 9.28572V39C6.75 40.7949 8.20508 42.25 10 42.25H30H33H53C54.7949 42.25 56.25 40.7949 56.25 39V9.28572C56.25 7.49079 54.7949 6.03572 53 6.03572H48.7281C46.7781 6.03572 44.9233 5.19238 43.6415 3.72286L42.8919 2.8636C42.2747 2.15605 41.3817 1.75 40.4428 1.75H33H30ZM30 0.25H33H40.4428C41.815 0.25 43.1202 0.843461 44.0223 1.87757L44.7718 2.73683C45.7688 3.87979 47.2114 4.53572 48.7281 4.53572H53C55.6234 4.53572 57.75 6.66236 57.75 9.28572V39C57.75 41.6233 55.6234 43.75 53 43.75H33H30H10C7.37665 43.75 5.25 41.6233 5.25 39V9.28572C5.25 6.66236 7.37664 4.53572 10 4.53572H14.2257C15.7424 4.53572 17.185 3.87979 18.182 2.73683L18.9316 1.87757C19.8336 0.843461 21.1388 0.25 22.5111 0.25H30Z" fill={fill}/>
                    <circle cx="31" cy="24" r="10.5" stroke={fill}/>
                </svg>
            )
        case "facebook":
            return (
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className={className}
                    viewBox="0 0 266.893 266.895"
                >
                    <path
                        id="fb_blue"
                        fill="#fff"
                        d="M248.082,262.307c7.854,0,14.223-6.369,14.223-14.225V18.812
                c0-7.857-6.368-14.224-14.223-14.224H18.812c-7.857,0-14.224,6.367-14.224,14.224v229.27c0,7.855,6.366,14.225,14.224,14.225
                H248.082z"
                    />
                    <path
                        id="fb_white"
                        fill="#FFFFFF"
                        d="M182.409,262.307v-99.803h33.499l5.016-38.895h-38.515V98.777c0-11.261,3.127-18.935,19.275-18.935
                l20.596-0.009V45.045c-3.562-0.474-15.788-1.533-30.012-1.533c-29.695,0-50.025,18.126-50.025,51.413v28.684h-33.585v38.895h33.585
                v99.803H182.409z"
                    />
                </svg>
            )
        case "instagram":
            return (
                <svg
                    className={className}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <path d="M256,49.471c67.266,0,75.233.257,101.8,1.469,24.562,1.121,37.9,5.224,46.778,8.674a78.052,78.052,0,0,1,28.966,18.845,78.052,78.052,0,0,1,18.845,28.966c3.45,8.877,7.554,22.216,8.674,46.778,1.212,26.565,1.469,34.532,1.469,101.8s-0.257,75.233-1.469,101.8c-1.121,24.562-5.225,37.9-8.674,46.778a83.427,83.427,0,0,1-47.811,47.811c-8.877,3.45-22.216,7.554-46.778,8.674-26.56,1.212-34.527,1.469-101.8,1.469s-75.237-.257-101.8-1.469c-24.562-1.121-37.9-5.225-46.778-8.674a78.051,78.051,0,0,1-28.966-18.845,78.053,78.053,0,0,1-18.845-28.966c-3.45-8.877-7.554-22.216-8.674-46.778-1.212-26.564-1.469-34.532-1.469-101.8s0.257-75.233,1.469-101.8c1.121-24.562,5.224-37.9,8.674-46.778A78.052,78.052,0,0,1,78.458,78.458a78.053,78.053,0,0,1,28.966-18.845c8.877-3.45,22.216-7.554,46.778-8.674,26.565-1.212,34.532-1.469,101.8-1.469m0-45.391c-68.418,0-77,.29-103.866,1.516-26.815,1.224-45.127,5.482-61.151,11.71a123.488,123.488,0,0,0-44.62,29.057A123.488,123.488,0,0,0,17.3,90.982C11.077,107.007,6.819,125.319,5.6,152.134,4.369,179,4.079,187.582,4.079,256S4.369,333,5.6,359.866c1.224,26.815,5.482,45.127,11.71,61.151a123.489,123.489,0,0,0,29.057,44.62,123.486,123.486,0,0,0,44.62,29.057c16.025,6.228,34.337,10.486,61.151,11.71,26.87,1.226,35.449,1.516,103.866,1.516s77-.29,103.866-1.516c26.815-1.224,45.127-5.482,61.151-11.71a128.817,128.817,0,0,0,73.677-73.677c6.228-16.025,10.486-34.337,11.71-61.151,1.226-26.87,1.516-35.449,1.516-103.866s-0.29-77-1.516-103.866c-1.224-26.815-5.482-45.127-11.71-61.151a123.486,123.486,0,0,0-29.057-44.62A123.487,123.487,0,0,0,421.018,17.3C404.993,11.077,386.681,6.819,359.866,5.6,333,4.369,324.418,4.079,256,4.079h0Z" />
                    <path d="M256,126.635A129.365,129.365,0,1,0,385.365,256,129.365,129.365,0,0,0,256,126.635Zm0,213.338A83.973,83.973,0,1,1,339.974,256,83.974,83.974,0,0,1,256,339.973Z" />
                    <circle cx="390.476" cy="121.524" r="30.23" />
                </svg>
            )
        case "pencil":
            return (
                <svg className={className} viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="26.9711" y="6.91499" width="9.45019" height="26.8967" transform="rotate(45.2004 26.9711 6.91499)" fill={fill}/>
                    <path d="M30.5818 3.32944C32.4335 1.49064 35.4253 1.50111 37.2641 3.35281V3.35281C39.1029 5.20452 39.0924 8.19627 37.2407 10.0351L34.6616 12.5962L28.0027 5.89054L30.5818 3.32944Z" fill={fill}/>
                    <path d="M6.85421 26.8916L13.5131 33.5972L3.73593 36.6472L6.85421 26.8916Z" fill={fill}/>
                </svg>
            )
        case "twitter":
            return (
                <svg className={className} viewBox="0 0 300.00006 244.18703">
                    <g transform="translate(-539.17946,-568.85777)">
                        <path d="m 633.89823,812.04479 c 112.46038,0 173.95627,-93.16765 173.95627,-173.95625 0,-2.64628 -0.0539,-5.28062 -0.1726,-7.90305 11.93799,-8.63016 22.31446,-19.39999 30.49762,-31.65984 -10.95459,4.86937 -22.74358,8.14741 -35.11071,9.62551 12.62341,-7.56929 22.31446,-19.54304 26.88583,-33.81739 -11.81284,7.00307 -24.89517,12.09297 -38.82383,14.84055 -11.15723,-11.88436 -27.04079,-19.31655 -44.62892,-19.31655 -33.76374,0 -61.14426,27.38052 -61.14426,61.13233 0,4.79784 0.5364,9.46458 1.58538,13.94057 -50.81546,-2.55686 -95.87353,-26.88582 -126.02546,-63.87991 -5.25082,9.03545 -8.27852,19.53111 -8.27852,30.73006 0,21.21186 10.79366,39.93837 27.20766,50.89296 -10.03077,-0.30992 -19.45363,-3.06348 -27.69044,-7.64676 -0.009,0.25652 -0.009,0.50661 -0.009,0.78077 0,29.60957 21.07478,54.3319 49.0513,59.93435 -5.13757,1.40062 -10.54335,2.15158 -16.12196,2.15158 -3.93364,0 -7.76596,-0.38716 -11.49099,-1.1026 7.78383,24.2932 30.35457,41.97073 57.11525,42.46543 -20.92578,16.40207 -47.28712,26.17062 -75.93712,26.17062 -4.92898,0 -9.79834,-0.28036 -14.58427,-0.84634 27.05868,17.34379 59.18936,27.46396 93.72193,27.46396" />
                    </g>
                </svg>
            )
        case "youtube":
            return (
                <svg
                    version="1.1"
                    className={className}
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 1024 721"
                >
                    <path
                        id="Triangle"
                        fill="#FFFFFF"
                        d="M407,493l276-143L407,206V493z"
                    />
                    <g id="Lozenge">
                        <g>
                            <path
                                d="M1013,156.3c0,0-10-70.4-40.6-101.4C933.6,14.2,890,14,870.1,11.6C727.1,1.3,512.7,1.3,512.7,1.3
                            h-0.4c0,0-214.4,0-357.4,10.3C135,14,91.4,14.2,52.6,54.9C22,85.9,12,156.3,12,156.3S1.8,238.9,1.8,321.6v77.5
                            C1.8,481.8,12,564.4,12,564.4s10,70.4,40.6,101.4c38.9,40.7,89.9,39.4,112.6,43.7c81.7,7.8,347.3,10.3,347.3,10.3
                            s214.6-0.3,357.6-10.7c20-2.4,63.5-2.6,102.3-43.3c30.6-31,40.6-101.4,40.6-101.4s10.2-82.7,10.2-165.3v-77.5
                            C1023.2,238.9,1013,156.3,1013,156.3z M407,493V206l276,144L407,493z"
                            />
                        </g>
                    </g>
                </svg>
            )
        case "linkedin":
            return (
                <svg className={className} viewBox="0 0 256 256">
                    <g transform="scale(1.40) translate(-240.55198,-430.96227)">
                        <g transform="matrix(1.018827,0,0,-1.018827,170.5996,498.03288)">
                            <path
                                d="M109.495-101.774V2.533H74.828v-104.307H109.495z
                        M92.168,16.775c12.081,0,19.612,8.01,19.612,18.021c-0.224,10.233-7.531,18.021-19.385,18.021
                        c-11.864,0-19.615-7.788-19.615-18.021c0-10.011,7.521-18.021,19.159-18.021H92.168L92.168,16.775z"
                            />
                            <path
                                d="M128.681-101.774h34.673v58.249
                        c0,3.119,0.226,6.235,1.143,8.462c2.5,6.232,8.209,12.681,17.784,12.681c12.547,0,17.562-9.568,17.562-23.588v-55.804h34.666
                        v59.81c0,32.039-17.1,46.946-39.913,46.946c-18.701,0-26.915-10.45-31.476-17.571h0.234V2.533h-34.673
                        C129.141-7.253,128.681-101.774,128.681-101.774L128.681-101.774z"
                            />
                        </g>
                    </g>
                </svg>
            )
        case "news":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={fill} stroke={fill} stroke-width="0" viewBox="0 0 24 24">
                    <path stroke="none" d="M19.875 3H4.125C2.953 3 2 3.897 2 5v14c0 1.103.953 2 2.125 2h15.75C21.047 21 22 20.103 22 19V5c0-1.103-.953-2-2.125-2zm0 16H4.125c-.057 0-.096-.016-.113-.016-.007 0-.011.002-.012.008L3.988 5.046c.007-.01.052-.046.137-.046h15.75c.079.001.122.028.125.008l.012 13.946c-.007.01-.052.046-.137.046z"/>
                    <path stroke="none" d="M6 7h6v6H6zm7 8H6v2h12v-2h-4zm1-4h4v2h-4zm0-4h4v2h-4z"/>
                </svg>
            )
        case "workshop":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={fill} stroke={fill} stroke-width="0" viewBox="0 0 24 24">
                        <path fill="none" stroke-width="2" d="M19 7s-5 7-12.5 7c-2 0-5.5 1-5.5 5v4h11v-4c0-2.5 3-1 7-8l-1.5-1.5M3 5V2h20v14h-3M11 1h4v2h-4V1ZM6.5 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
                </svg>
            )
        case "lightbulb":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill={fill} stroke={fill} className={className} stroke-width="0" viewBox="0 0 24 24">
                    <g stroke="none">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M7.941 18c-.297-1.273-1.637-2.314-2.187-3a8 8 0 1 1 12.49.002c-.55.685-1.888 1.726-2.185 2.998H7.94zM16 20v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1h8zm-3-9.995V6l-4.5 6.005H11v4l4.5-6H13z"/>
                    </g>
                </svg>
            )
        case "message":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill={fill} stroke={fill} className={className} stroke-width="0" viewBox="0 0 1024 1024">
                    <path stroke="none" d="M464 512a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm200 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm-400 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"/>
                </svg>
            )
    }
}
