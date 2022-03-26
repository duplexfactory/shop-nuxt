export default function () {
    let scriptExists: boolean = false;
    document.body.querySelectorAll("script").forEach((s) => {
        if (s.src.includes('www.instagram.com/embed.js')) {
            scriptExists = true;
        }
    });
    if (!scriptExists) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//www.instagram.com/embed.js";
        document.body.appendChild(script);
    }
    else {
        if (window['instgrm'])
            window['instgrm'].Embeds.process();
    }
}