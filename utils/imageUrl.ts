// import crypto from "crypto";
// import {useRuntimeConfig} from "#app";
// const config = useRuntimeConfig();
// const algorithm = "aes-256-ecb";

// export function encryptImageUrl(url: string) {
//     const cipher = crypto.createCipheriv(algorithm, config.IMAGE_KEY, null);
//     const code = Buffer.concat([cipher.update(url), cipher.final()]).toString("base64")
//         .replace(/\//g, "-")
//         .replace(/\+/g, ".");
//     return "api/image?i=" + code;
// }
//
// export function decryptImageUrl(code: string) {
//     const decipher = crypto.createDecipheriv(algorithm, config.IMAGE_KEY, null);
//     const buffer = Buffer.from(code.replace(/-/g, "/").replace(/\./g, "+"), "base64")
//     const decrpyted = Buffer.concat([decipher.update(buffer), decipher.final()]);
//     return decrpyted.toString();
// }
