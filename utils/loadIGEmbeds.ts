import { backOff } from "exponential-backoff";

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

    backOff(() => {
        return new Promise((resolve, reject) => {
            if (document.getElementsByTagName("blockquote").length === 0)
                throw "DOM not loaded";
            window['instgrm'].Embeds.process();
            resolve('foo');
        });
    }).then(() => {

    }).catch((e) => {

    });
}