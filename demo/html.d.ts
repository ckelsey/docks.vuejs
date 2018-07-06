declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

declare module "*.html" {
    const content: string;
    export default content;
}