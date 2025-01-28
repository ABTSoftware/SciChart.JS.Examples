const fileName: string = "";
// Since the file path in the dynamic import statement below may be variable, the webpack will try to match all of the files satisfying the string template.
// In this case we are matching all of the images with ".jpg" extension within project.
// This will cause them to be processed by Webpack and added to the output.
// Also this will create bundle chunks with import statements for all of the found images.
// The "webpackMode: 'eager'" is a webpack's "magic comment" which tells the bundler to produce a single chunk for all of the found images.
// Since we don't need this chunk we can remove it somewhere in the middle of the build process.
// Source reference: https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
import(/* webpackMode: 'eager' */ `./${fileName}.jpg`);
