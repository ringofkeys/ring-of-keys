import React from "react"

const VimeoEmbed = (props) => {
    return (
        <>
            <div style={{ padding: "55.99% 0 0 0", position: "relative" }}>
                <iframe
                    src={`https://player.vimeo.com/video/${props.id}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    frameBorder="0"
                    allow="autoplay fullscreen picture-in-picture"
                    allowFullScreen
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                    title={props.title}
                />
            </div>
            <script src="https://player.vimeo.com/api/player.js"></script>
        </>
    )
}

export default VimeoEmbed
