# Styling the Loader

1. SVG was created here https://app.svgator.com/
2. The SVG is copied with Webpack CopyPlugin
3. This code is used to embed the SVG. Using just img tag does not work, because in this case the SVG is static

```typescript
const loaderImage = document.createElement('object');
loaderImage.type = 'image/svg+xml';
loaderImage.data = '/svg_animation_ext.svg';
```
