declare module "*.svg" {
    const content: string;
    export default content;
}

declare module '*.scss';

declare module "*.png" {
    const value: any;
    export = value;
}