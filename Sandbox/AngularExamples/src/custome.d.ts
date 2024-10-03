// declare module "*.png" {
//   const image: string;
//   export default image;
//   }

declare module "url:*" {
    const value: string;
    export default value;
}
