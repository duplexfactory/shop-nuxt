import {OutputData} from "@editorjs/editorjs";

export default interface Blog {
    id: string;
    created: number;
    title: string;
    slug: string;
    metaDesc: string;
    htmlContent: OutputData;
}
